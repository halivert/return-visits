import { useQuery } from "@tanstack/vue-query"
import { peopleQuery } from "./peopleQuery"

export function usePeopleQuery() {
	return useQuery(peopleQuery())
}
