import { createApp } from "vue"
import { VueQueryPlugin } from "@tanstack/vue-query"
import App from "./App.vue"
import { getDatabase } from "./db/useDatabase"
import { router } from "./router"

import "./style.css"

getDatabase()

createApp(App)
	.use(VueQueryPlugin, {
		enableDevtoolsV6Plugin: true,
	})
	.use(router)
	.mount("#app")
