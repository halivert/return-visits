import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { Person } from "@/db/models/Person"
import { addToStore } from "@/db/useDatabase"
import { peopleKeys } from "@/people/queries/peopleKeys"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"

export function useAddPeople() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			person,
			returnVisit,
		}: {
			person: Omit<Person, "id">
			returnVisit?: Omit<ReturnVisit, "personId">
		}): Promise<{ person: Person; returnVisit?: ReturnVisit }> => {
			const newPerson: Omit<Person, "id"> = {
				colony: person.colony.trim(),
				name: person.name.trim(),
				description: person.description.trim(),
				location: person.location,
			}

			const newPersonId = await addToStore("people", newPerson)

			const newReturnVisit: ReturnVisit | undefined =
				returnVisit && newPersonId != undefined
					? {
							personId: newPersonId,
							date: returnVisit.date,
							topic: returnVisit.topic.trim(),
							returnDate: returnVisit.returnDate,
							notes: returnVisit.notes?.trim(),
					  }
					: undefined

			const newReturnVisitKey = newReturnVisit
				? await addToStore("returnVisits", newReturnVisit)
				: undefined

			return {
				person: {
					id: newPersonId,
					...newPerson,
				},
				returnVisit:
					newReturnVisitKey && newReturnVisit ? newReturnVisit : undefined,
			}
		},
		onSuccess: ({ person, returnVisit }) => {
			queryClient.invalidateQueries({ queryKey: peopleKeys.all() })
			queryClient.setQueryData(peopleKeys.detail(person.id), person)

			if (returnVisit) {
				queryClient.invalidateQueries({ queryKey: returnVisitsKeys.all() })
				queryClient.setQueryData(
					returnVisitsKeys.detail(returnVisit.personId, returnVisit.date),
					returnVisit
				)
			}
		},
	})
}
