import { MaybeRef, UnwrapRef } from "vue"
import { UseQueryOptions } from "@tanstack/vue-query"
import { peopleKeys } from "./peopleKeys"
import { getFromStore, PEOPLE_STORE } from "../../db/useDatabase"
import { Person } from "../../db/models/Person"
import { computed, toRef } from "@vue/reactivity"

type QueryOptions = UseQueryOptions<
	Person,
	Error,
	Person,
	Person,
	ReturnType<typeof peopleKeys.detail>
>

export function personQuery(
	id: MaybeRef<number>,
	options: MaybeRef<Omit<UnwrapRef<QueryOptions>, "queryKey" | "queryFn">> = {}
): QueryOptions {
	return computed(() => ({
		...toRef(options).value,
		queryKey: peopleKeys.detail(id),
		queryFn: ({ queryKey }) => getFromStore<Person>(PEOPLE_STORE, queryKey[2]),
	}))
}
