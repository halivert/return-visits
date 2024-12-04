<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useImportPeople } from "@/people/queries/useImportPeople"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { useImportReturnVisits } from "@/return-visits/queries/useImportReturnVisits"
import { useReturnVisits } from "@/return-visits/queries/useReturnVisits"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { Person } from "@/db/models/Person"
import VButton from "@/components/VButton.vue"

interface Data {
	people: Person[]
	returnVisits: ReturnVisit[]
}

const peopleQuery = usePeopleQuery()
const returnVisitsQuery = useReturnVisits()
const router = useRouter()

const importPeople = useImportPeople()
const importReturnVisits = useImportReturnVisits()
const fileInput = ref<HTMLInputElement>()

const url = computed(() => {
	if (peopleQuery.isLoading.value || returnVisitsQuery.isLoading.value) {
		return undefined
	}

	const data: Data = {
		people: peopleQuery.data.value ?? [],
		returnVisits: returnVisitsQuery.data.value ?? [],
	}

	const blob = new Blob([JSON.stringify(data)], { type: "application/json" })

	return URL.createObjectURL(blob)
})

const fileName = computed(() => {
	return new Date().toISOString() + ".return-visits"
})

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

async function importData(event: Event) {
	const sure = confirm(
		"¿Segura que deseas importar estos datos?\nEsto sobreescribirá los datos actuales."
	)

	if (!sure) return

	const files = (event.target as HTMLInputElement).files
	if (!files?.[0]) {
		alert("Error en importación de datos")
		return
	}

	try {
		const file = files[0]
		const data: { people: unknown; returnVisits: unknown } = JSON.parse(
			await file.text()
		)

		if (!validPeople(data?.people)) {
			throw new Error("Error en estructura de archivo")
		}

		const peopleIds = data.people.map(({ id }) => id)

		if (!validReturnVisits(peopleIds, data.returnVisits)) {
			throw new Error("Error en estructura de archivo")
		}

		await importPeople.mutateAsync(
			data.people.map((person) => ({
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
			}))
		)

		await importReturnVisits.mutateAsync(
			data.returnVisits.map((returnVisit) => ({
				personId: returnVisit.personId,
				date: new Date(returnVisit.date),
				topic: returnVisit.topic,
				returnDate: new Date(returnVisit.returnDate),
				notes: returnVisit.notes,
			}))
		)

		router.back()
	} catch (e) {
		alert(e instanceof Error ? e.message : "Error en la importación")
	}
}
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<div class="flex gap-3 justify-center">
			<VButton color="asparagus" :href="url" :download="fileName" external>
				Exportar datos
			</VButton>

			<input
				ref="fileInput"
				class="hidden"
				@change="importData"
				type="file"
				accept=".return-visits,application/json"
			/>

			<VButton
				:loading="
					importReturnVisits.isPending.value || importPeople.isPending.value
				"
				color="lemon"
				@click="fileInput?.click()"
			>
				Importar datos
			</VButton>
		</div>
	</main>
</template>
