import { computed, MaybeRef, unref, UnwrapRef } from "vue"
import { UseQueryOptions } from "@tanstack/vue-query"
import { peopleKeys } from "@/people/queries/peopleKeys"
import { getAllFromStore } from "@/db/useDatabase"
import { Person } from "@/db/models/Person"

type QueryOptions = UseQueryOptions<
	Person[],
	Error,
	Person[],
	Person[],
	ReturnType<typeof peopleKeys.all>
>

export function peopleQuery(
	options: MaybeRef<Omit<UnwrapRef<QueryOptions>, "queryKey" | "queryFn">> = {}
): QueryOptions {
	return computed(() => ({
		...unref(options),
		queryKey: peopleKeys.all(),
		queryFn: () => getAllFromStore("people"),
	}))
}
