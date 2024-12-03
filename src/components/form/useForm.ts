import { reactive } from "vue"

export function useForm<T extends object>(data: T) {
	const formData = reactive(data)

	const errors = reactive<Partial<Record<keyof T, string>>>({})

	return {
		...formData,
		errors,
	}
}
