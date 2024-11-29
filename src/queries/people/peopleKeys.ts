export const peopleKeys = {
	all: () => ["people"] as const,
	details: () => [...peopleKeys.all(), "detail"] as const,
	detail: (id: number) => [...peopleKeys.details(), id] as const,
}
