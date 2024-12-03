import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { computed, MaybeRef, unref } from "vue"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { addToStore } from "@/db/useDatabase"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"

interface UseAddReturnVisitParams {
	personId: MaybeRef<number>
}

export function useAddReturnVisit({ personId }: UseAddReturnVisitParams) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: computed(
			() =>
				async (
					returnVisit: Omit<ReturnVisit, "personId">
				): Promise<ReturnVisit> => {
					const newReturnVisit: ReturnVisit = {
						personId: unref(personId),
						date: returnVisit.date,
						returnDate: returnVisit.returnDate,
						topic: returnVisit.topic.trim(),
						notes: returnVisit.notes?.trim(),
					}

					await addToStore("returnVisits", newReturnVisit)

					return newReturnVisit
				}
		),
		onSuccess: (returnVisit) => {
			queryClient.invalidateQueries({
				queryKey: returnVisitsKeys.list(returnVisit.personId),
			})

			queryClient.setQueryData(
				returnVisitsKeys.detail(returnVisit.personId, returnVisit.date),
				returnVisit
			)
		},
	})
}
