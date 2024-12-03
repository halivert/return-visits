import { reactive } from "vue"

export function useForm<T extends object>(data: T) {
	const errors: Partial<Record<keyof T, string>> = {}

	return reactive({
		...data,
		errors,
	})
}
