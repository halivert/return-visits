import { useQuery } from "@tanstack/vue-query"
import { personReturnVisitsQuery } from "@/return-visits/queries/personReturnVisitsQuery"

interface UsePersonReturnVisitsParams {
	personId: Parameters<typeof personReturnVisitsQuery>[0]
	options?: Parameters<typeof personReturnVisitsQuery>[1]
}

export function usePersonReturnVisits({
	personId,
	options,
}: UsePersonReturnVisitsParams) {
	return useQuery(personReturnVisitsQuery(personId, options))
}
