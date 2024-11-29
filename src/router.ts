import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"

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
				{
					path: "people",
					children: [
						{
							path: "create",
							component: () => import("../src/pages/people/Create.vue"),
						},
					],
				},
			],
		},
		{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
	],
})
