import { computed, MaybeRef, unref } from "vue"
import { useReturnVisits } from "../queries/useReturnVisits"

interface UseAvailableTopicsParams {
	personId?: MaybeRef<number>
}

export function useAvailableTopics({
	personId,
}: UseAvailableTopicsParams = {}) {
	const returnVisits = useReturnVisits()

	return computed(
		() =>
			new Set(
				returnVisits.data.value
					?.filter((returnVisit) => {
						if (unref(personId) == null) return true

						return returnVisit.personId === unref(personId)
					})
					?.map(({ topic }) => topic)
			)
	)
}
