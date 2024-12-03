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
			const newPersonId = await addToStore("people", person)

			const newReturnVisitKey = returnVisit
				? await addToStore("returnVisits", {
						...returnVisit,
						personId: newPersonId,
				  })
				: undefined

			return {
				person: {
					id: newPersonId,
					...person,
				},
				...(newReturnVisitKey
					? {
							...returnVisit,
							personId: newReturnVisitKey[0],
							date: newReturnVisitKey[1],
					  }
					: {}),
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
