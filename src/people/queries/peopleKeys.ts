import { MaybeRef } from "vue"

export const peopleKeys = {
	all: () => ["people"] as const,
	details: () => [...peopleKeys.all(), "detail"] as const,
	detail: (id: MaybeRef<number>) => [...peopleKeys.details(), id] as const,
}
