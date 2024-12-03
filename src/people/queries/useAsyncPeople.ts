import { useQueryClient } from "@tanstack/vue-query"
import { peopleQuery } from "@/people/queries/peopleQuery"

export function useAsyncPeople() {
	const queryClient = useQueryClient()

	return queryClient.ensureQueryData(peopleQuery())
}
