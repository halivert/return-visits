import { useQuery } from "@tanstack/vue-query"
import { peopleKeys } from "./peopleKeys"
import { PEOPLE_STORE, getAllFromStore } from "../../db/useDatabase"
import { Person } from "../../db/models/Person"

export default function usePeople() {
	return useQuery({
		queryKey: peopleKeys.all(),
		queryFn: () => getAllFromStore<Person>(PEOPLE_STORE),
	})
}
