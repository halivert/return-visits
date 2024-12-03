import { MaybeRef, UnwrapRef } from "vue"
import { computed, unref } from "@vue/reactivity"
import { UseQueryOptions } from "@tanstack/vue-query"
import { getAllFromStore } from "../../db/useDatabase"
import { returnVisitsKeys } from "./returnVisitsKeys"
import { ReturnVisit } from "../models/ReturnVisit"

type QueryOptions = UseQueryOptions<
	ReturnVisit[],
	Error,
	ReturnVisit[],
	ReturnVisit[],
	ReturnType<typeof returnVisitsKeys.list>
>

export function personReturnVisitsQuery(
	personId: MaybeRef<number>,
	options: MaybeRef<Omit<UnwrapRef<QueryOptions>, "queryKey" | "queryFn">> = {}
): QueryOptions {
	return computed(() => ({
		...unref(options),
		queryKey: returnVisitsKeys.list(personId),
		queryFn: async ({ queryKey }) => {
			const returnVisits = await getAllFromStore(
				"returnVisits",
				"personId",
				queryKey[2]
			)

			return returnVisits.toSorted(
				(a, b) => b.date.getTime() - a.date.getTime()
			)
		},
	}))
}
