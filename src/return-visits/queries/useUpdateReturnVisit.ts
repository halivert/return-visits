import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { computed, MaybeRef, unref } from "vue"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { addToStore, deleteFromStore, updateInStore } from "@/db/useDatabase"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"
import { useReturnVisit } from "@/return-visits/queries/useReturnVisit"

interface UseUpdateReturnVisitParams {
	personId: MaybeRef<number>
	date: MaybeRef<Date>
}

export function useUpdateReturnVisit({
	personId,
	date,
}: UseUpdateReturnVisitParams) {
	const queryClient = useQueryClient()
	const { data: originalReturnVisit } = useReturnVisit({ personId, date })

	return useMutation({
		mutationFn: computed(
			() =>
				async (returnVisit: Partial<ReturnVisit>): Promise<ReturnVisit> => {
					if (!originalReturnVisit.value) {
						return Promise.reject(new Error("Revisita no encontrada"))
					}

					const original = originalReturnVisit.value

					const data: ReturnVisit = {
						personId: returnVisit.personId ?? original.personId,
						date: returnVisit.date ?? original.date,
						topic: (returnVisit.topic ?? original.topic).trim(),
						returnDate: returnVisit.returnDate ?? original.returnDate,
						notes: (returnVisit.notes ?? original.notes)?.trim(),
					}

					/**
					 * If the person or dates are different, we want to delete and create
					 * new return visit
					 */
					if (
						unref(personId) !== data.personId ||
						unref(date).toISOString() !== data.date.toISOString()
					) {
						await deleteFromStore("returnVisits", [
							unref(personId),
							unref(date),
						])

						await addToStore("returnVisits", data)
					} else {
						await updateInStore(
							"returnVisits",
							[unref(personId), unref(date)],
							data
						)
					}

					return data
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

			/**
			 * If the return visit change person id, invalidate also old person return
			 * visits
			 */
			if (returnVisit.personId !== unref(personId)) {
				queryClient.invalidateQueries({
					queryKey: returnVisitsKeys.list(personId),
				})
			}

			/**
			 * If the return visit changes from person or date, invalidate last detail
			 * query
			 */
			if (
				returnVisit.personId !== unref(personId) ||
				returnVisit.date !== unref(date)
			) {
				queryClient.invalidateQueries({
					queryKey: returnVisitsKeys.detail(personId, date),
				})
			}
		},
	})
}
