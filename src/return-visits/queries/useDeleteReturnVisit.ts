import { computed, MaybeRef, unref } from "vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { deleteFromStore } from "@/db/useDatabase"
import { returnVisitsKeys } from "./returnVisitsKeys"

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
			queryClient.invalidateQueries({ queryKey: returnVisitsKeys.all() })
		},
	})
}
