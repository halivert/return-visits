import { UseQueryOptions } from "@tanstack/vue-query"
import { peopleKeys } from "./peopleKeys"
import { getAllFromStore, PEOPLE_STORE } from "../../db/useDatabase"
import { Person } from "../../db/models/Person"

export function peopleQuery(): UseQueryOptions<Person[]> {
	return {
		queryKey: peopleKeys.all(),
		queryFn: () => getAllFromStore<Person>(PEOPLE_STORE),
	}
}
