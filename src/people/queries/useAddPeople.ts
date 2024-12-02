import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { Person } from "../../db/models/Person"
import { addToStore } from "../../db/useDatabase"
import { peopleKeys } from "./peopleKeys"

export function useAddPeople() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (person: Omit<Person, "id">): Promise<Person> => {
			const newPersonId = await addToStore("people", person)

			return {
				id: newPersonId,
				...person,
			}
		},
		onSuccess: (person) => {
			queryClient.invalidateQueries({ queryKey: peopleKeys.all() })
			queryClient.setQueryData(peopleKeys.detail(person.id), person)
		},
	})
}
