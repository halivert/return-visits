import { useQuery } from "@tanstack/vue-query"
import { peopleQuery } from "@/people/queries/peopleQuery"

export function usePeopleQuery() {
	return useQuery(peopleQuery())
}
