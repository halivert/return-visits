import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { addToStore } from "@/db/useDatabase"
import { returnVisitsKeys } from "./returnVisitsKeys"

export function useImportReturnVisits() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			returnVisits: ReturnVisit[]
		): Promise<[number, Date][]> => {
			const createPromises = returnVisits.map((returnVisit) =>
				addToStore("returnVisits", returnVisit)
			)

			const result = await Promise.allSettled(createPromises)

			return result
				.filter((item) => item.status === "fulfilled")
				.map((item) => item.value)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: returnVisitsKeys.all() })
		},
	})
}
