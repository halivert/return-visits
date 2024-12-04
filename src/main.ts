import { createApp } from "vue"
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query"
import App from "@/App.vue"
import { getDatabase } from "@/db/useDatabase"
import { router } from "@/router"

import "./style.css"

getDatabase()

createApp(App)
	.use(VueQueryPlugin, {
		enableDevtoolsV6Plugin: true,
		queryClient: new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60 * 5,
				},
			},
		}),
	})
	.use(router)
	.mount("#app")
