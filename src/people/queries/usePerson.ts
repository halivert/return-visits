import { useQuery } from "@tanstack/vue-query"
import { personQuery } from "@/people/queries/personQuery"

interface UsePersonParams {
	id: Parameters<typeof personQuery>[0]
	options?: Parameters<typeof personQuery>[1]
}

export function usePerson({ id, options }: UsePersonParams) {
	return useQuery(personQuery(id, options))
}
