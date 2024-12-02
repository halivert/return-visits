import { MaybeRef } from "vue"

export const returnVisitsKeys = {
	all: () => ["return-visits"] as const,
	lists: () => [...returnVisitsKeys.all(), "list"] as const,
	list: (personId: MaybeRef<number>) =>
		[...returnVisitsKeys.lists(), personId] as const,
	details: () => [...returnVisitsKeys.all(), "detail"] as const,
	detail: (personId: MaybeRef<number>, date: MaybeRef<Date>) =>
		[...returnVisitsKeys.details(), personId, date] as const,
}
