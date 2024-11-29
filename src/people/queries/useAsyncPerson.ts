import { useQueryClient } from "@tanstack/vue-query"
import { personQuery } from "./personQuery"

interface UseAsyncPersonParams {
	id: Parameters<typeof personQuery>[0]
	options?: Parameters<typeof personQuery>[1]
}

export function useAsyncPerson({ id, options }: UseAsyncPersonParams) {
	const queryClient = useQueryClient()

	return queryClient.ensureQueryData(personQuery(id, options))
}
