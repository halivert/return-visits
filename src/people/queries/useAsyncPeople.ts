import { useQueryClient } from "@tanstack/vue-query"
import { peopleQuery } from "./peopleQuery"

export function useAsyncPeople() {
	const queryClient = useQueryClient()

	return queryClient.ensureQueryData(peopleQuery())
}
