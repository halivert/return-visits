import { computed } from "vue"
import { useRouter } from "vue-router"

export function usePreviousUrl() {
	const router = useRouter()

	return computed(() => {
		const lastPath = router.options.history.state.back
		return typeof lastPath === "string" ? lastPath : "/"
	})
}
