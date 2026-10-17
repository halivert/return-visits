import { computed } from "vue"
import { getAllFromStore } from "@/db/useDatabase"
import { Person } from "@/db/models/Person"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { useImportPeople } from "@/people/queries/useImportPeople"
import { useImportReturnVisits } from "@/return-visits/queries/useImportReturnVisits"

export interface BackupData {
	people: Person[]
	returnVisits: ReturnVisit[]
}

export async function collectBackupData(): Promise<BackupData> {
	const [people, returnVisits] = await Promise.all([
		getAllFromStore("people"),
		getAllFromStore("returnVisits"),
	])

	return { people, returnVisits }
}

function validPeople(people: unknown): people is Person[] {
	if (!Array.isArray(people)) return false

	return people.every((person) => {
		if (!Number.isInteger(person.id)) return false
		if (typeof person?.name !== "string" || !person?.name) return false
		if (typeof person?.colony !== "string" || !person?.colony) return false
		if (person?.description == undefined) return false
		if (person?.location) {
			if (typeof person.location !== "object") return false

			if (!Number.isFinite(person.location.latitude)) return false
			if (!Number.isFinite(person.location.longitude)) return false
			if (
				person.location.altitude &&
				!Number.isFinite(person.location.altitude)
			) {
				return false
			}
		}
		return true
	})
}

function validReturnVisits(
	peopleIds: number[],
	returnVisits: unknown
): returnVisits is ReturnVisit[] {
	if (!Array.isArray(returnVisits)) return false

	return returnVisits.every((returnVisit) => {
		if (!peopleIds.includes(returnVisit.personId)) return false

		if (
			!returnVisit.date ||
			new Date(returnVisit.date).toString() === "Invalid Date"
		) {
			return false
		}

		if (typeof returnVisit?.topic !== "string" || !returnVisit?.topic) {
			return false
		}

		if (
			!returnVisit.returnDate ||
			new Date(returnVisit.returnDate).toString() === "Invalid Date"
		) {
			return false
		}

		return true
	})
}

/** Validates data coming from a backup file or a transfer */
export function parseBackupData(data: unknown): BackupData {
	const { people, returnVisits } = (data ?? {}) as Record<string, unknown>

	if (!validPeople(people)) {
		throw new Error("Error en estructura de archivo")
	}

	const peopleIds = people.map(({ id }) => id)

	if (!validReturnVisits(peopleIds, returnVisits)) {
		throw new Error("Error en estructura de archivo")
	}

	return {
		people: people.map((person) => ({
			id: person.id,
			name: person.name,
			colony: person.colony,
			description: person.description,
			location: person.location
				? {
						latitude: person.location.latitude,
						longitude: person.location.longitude,
						altitude: person.location.altitude,
					}
				: undefined,
		})),
		returnVisits: returnVisits.map((returnVisit) => ({
			// Backups made before notifications don't have uuid
			uuid:
				typeof returnVisit.uuid === "string" && returnVisit.uuid
					? returnVisit.uuid
					: crypto.randomUUID(),
			personId: returnVisit.personId,
			date: new Date(returnVisit.date),
			topic: returnVisit.topic,
			returnDate: new Date(returnVisit.returnDate),
			notes: returnVisit.notes,
		})),
	}
}

/** Replaces all data in this device */
export function useRestoreBackup() {
	const importPeople = useImportPeople()
	const importReturnVisits = useImportReturnVisits()

	return {
		isPending: computed(
			() => importPeople.isPending.value || importReturnVisits.isPending.value
		),
		restore: async (data: BackupData) => {
			await importPeople.mutateAsync(data.people)
			await importReturnVisits.mutateAsync(data.returnVisits)
		},
	}
}
