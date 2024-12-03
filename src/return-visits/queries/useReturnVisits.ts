import { useQuery } from "@tanstack/vue-query"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"
import { getAllFromStore } from "@/db/useDatabase"

export function useReturnVisits() {
	return useQuery({
		queryKey: returnVisitsKeys.all(),
		queryFn: () => getAllFromStore("returnVisits"),
	})
}
