import { MaybeRef, UnwrapRef } from "vue"
import { computed, unref } from "@vue/reactivity"
import { UseQueryOptions } from "@tanstack/vue-query"
import { peopleKeys } from "./peopleKeys"
import { getFromStore, PEOPLE_STORE } from "../../db/useDatabase"
import { Person } from "../../db/models/Person"

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
		...unref(options),
		queryKey: peopleKeys.detail(id),
		queryFn: ({ queryKey }) => getFromStore<Person>(PEOPLE_STORE, queryKey[2]),
	}))
}
