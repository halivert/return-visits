import { computed } from "vue"
import { usePeopleQuery } from "../queries/usePeople"

export function useColonies() {
	const peopleQuery = usePeopleQuery()

	return computed(
		() => new Set(peopleQuery.data.value?.map(({ colony }) => colony))
	)
}
