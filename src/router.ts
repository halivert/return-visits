import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import Home from "./components/Home.vue"

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			component: App,
			children: [
				{
					path: "/",
					component: Home,
				},
			],
		},
	],
})
