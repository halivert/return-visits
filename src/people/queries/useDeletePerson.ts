import { computed, MaybeRef, unref } from "vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { deleteFromStore } from "@/db/useDatabase"
import { peopleKeys } from "@/people/queries/peopleKeys"
import { usePersonReturnVisits } from "@/return-visits/queries/usePersonReturnVisits"
import { returnVisitsKeys } from "@/return-visits/queries/returnVisitsKeys"

interface UseDeletePersonParams {
	id: MaybeRef<number>
}

export function useDeletePerson({ id }: UseDeletePersonParams) {
	const queryClient = useQueryClient()
	const { data: returnVisits } = usePersonReturnVisits({ personId: id })

	return useMutation({
		mutationFn: computed(() => async () => {
			await deleteFromStore("people", unref(id))

			const deletePromises =
				returnVisits.value?.map((returnVisit) => {
					return deleteFromStore("returnVisits", [unref(id), returnVisit.date])
				}) ?? []

			await Promise.allSettled(deletePromises)
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: peopleKeys.all() })
			queryClient.invalidateQueries({ queryKey: returnVisitsKeys.all() })
		},
	})
}
