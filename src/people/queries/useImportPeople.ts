import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { Person } from "@/db/models/Person"
import { addToStore, clearStore } from "@/db/useDatabase"
import { peopleKeys } from "@/people/queries/peopleKeys"

export function useImportPeople() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (people: Person[]): Promise<number[]> => {
			await clearStore("people")

			const createPromises = people.map((person) =>
				addToStore("people", person)
			)

			const result = await Promise.allSettled(createPromises)

			return result
				.filter((item) => item.status === "fulfilled")
				.map((item) => item.value)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: peopleKeys.all() })
		},
	})
}
