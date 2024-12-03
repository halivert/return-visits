import { computed, MaybeRef, unref } from "vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { deleteFromStore } from "@/db/useDatabase"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"

interface UseDeleteReturnVisitParams {
	personId: MaybeRef<number>
	date: MaybeRef<Date>
}

export function useDeleteReturnVisit({
	personId,
	date,
}: UseDeleteReturnVisitParams) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: computed(() => async () => {
			await deleteFromStore("returnVisits", [unref(personId), unref(date)])
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: returnVisitsKeys.list(personId),
			})

			queryClient.removeQueries({
				queryKey: returnVisitsKeys.detail(personId, date),
			})
		},
	})
}
