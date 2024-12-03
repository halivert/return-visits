import { useQuery } from "@tanstack/vue-query"
import { MaybeRef } from "vue"
import { returnVisitsKeys } from "./returnVisitsKeys"
import { getFromStore } from "@/db/useDatabase"

interface UseReturnVisitParams {
	personId: MaybeRef<number>
	date: MaybeRef<Date>
}

export function useReturnVisit({ personId, date }: UseReturnVisitParams) {
	return useQuery({
		queryKey: returnVisitsKeys.detail(personId, date),
		queryFn: ({ queryKey }) =>
			getFromStore("returnVisits", [queryKey[2], queryKey[3]]),
	})
}
