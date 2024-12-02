import { createRouter, createWebHistory } from "vue-router"
import AppHome from "@/pages/AppHome.vue"
import NotFound from "@/pages/NotFound.vue"

const appName = "Revisitas"

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "Home",
			component: AppHome,
		},
		{
			path: "/people",
			children: [
				{
					path: "create",
					name: "PeopleCreate",
					component: () => import("@people/pages/PeopleCreate.vue"),
					meta: {
						title: `Agregar persona | ${appName}`,
					},
				},
				{
					path: ":id",
					component: () => import("@people/pages/PeopleShow.vue"),
					props: (to) => ({
						id: parseInt(to.params.id as string, 10),
					}),
					children: [
						{
							path: "",
							name: "PeopleShow",
							component: () =>
								import("@return-visits/components/ReturnVisitsList.vue"),
							props: (to) => ({
								id: parseInt(to.params.id as string, 10),
							}),
						},
						{
							path: "return-visits/create",
							name: "PeopleReturnVisitsCreate",
							component: () =>
								import("@return-visits/components/ReturnVisitsCreate.vue"),
							props: (to) => ({
								id: parseInt(to.params.id as string, 10),
							}),
						},
					],
				},
				{
					path: ":id/edit",
					name: "PeopleEdit",
					component: () => import("@people/pages/PeopleEdit.vue"),
					props: (to) => ({
						id: parseInt(to.params.id as string, 10),
					}),
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
