import { createApp } from "vue"
import {
	MutationCache,
	QueryClient,
	VueQueryPlugin,
} from "@tanstack/vue-query"
import App from "@/App.vue"
import { getDatabase } from "@/db/useDatabase"
import { router } from "@/router"
import { syncReminders } from "@/notifications/reminders"
import { requestPersistentStorage } from "@/backups/backupStatus"

import "./style.css"

getDatabase()

// Ask the browser to not delete the database when storage is low
requestPersistentStorage().catch(console.error)

// Keep push reminders up to date, also retries syncs that failed offline
syncReminders().catch(console.error)
window.addEventListener("online", () => syncReminders().catch(console.error))

createApp(App)
	.use(VueQueryPlugin, {
		enableDevtoolsV6Plugin: true,
		queryClient: new QueryClient({
			// Any change to people or return visits can change upcoming reminders
			mutationCache: new MutationCache({
				onSuccess: () => {
					syncReminders().catch(console.error)
				},
			}),
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60 * 5,
				},
			},
		}),
	})
	.use(router)
	.mount("#app")
