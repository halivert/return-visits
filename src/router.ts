import { createRouter, createWebHistory } from "vue-router"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"

const appName = "Revisitas"

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: Home,
		},
		{
			path: "/people",
			children: [
				{
					path: "create",
					name: "PeopleCreate",
					component: () => import("../src/people/pages/Create.vue"),
					meta: {
						title: `Agregar persona | ${appName}`,
					},
				},
				{
					path: ":id",
					name: "PeopleShow",
					component: () => import("../src/people/pages/Show.vue"),
					props: (to) => ({
						id: parseInt(to.params.id as string, 10),
					}),
					children: [
						{
							path: "",
							name: "PeopleReturnVisitsIndex",
							component: () => import("../src/pages/NotFound.vue"),
						},
						{
							path: "return-visits/create",
							name: "PeopleReturnVisitsCreate",
							component: () => import("../src/pages/NotFound.vue"),
						},
					],
				},
			],
		},
		{ path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
	],
})

router.beforeEach((to) => {
	document.title = typeof to.meta.title === "string" ? to.meta.title : appName
	to.meta.appName = appName
})
