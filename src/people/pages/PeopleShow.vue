<script lang="ts">
export default {
	async beforeRouteEnter(to, _from, next) {
		try {
			await useAsyncPerson({ id: parseInt(to.params.id as string, 10) })

			next()
		} catch (e) {
			next({ name: "NotFound" })
		}
	},
}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"
import { useTitle } from "@vueuse/core"
import { usePerson } from "../queries/usePerson"
import { useAsyncPerson } from "../queries/useAsyncPerson"
import { DAYS } from "../../constants"
import { usePersonReturnVisits } from "@/return-visits/queries/usePersonReturnVisits"

const router = useRouter()
const route = useRoute()

onBeforeRouteUpdate((to) => {
	useAsyncPerson({ id: parseInt(to.params.id as string, 10) }).catch(() => {
		router.replace({ name: "NotFound" })
	})
})

const props = defineProps<{
	id: number
}>()

const id = computed(() => props.id)
const personQuery = usePerson({ id })
const person = computed(() => personQuery.data.value)
const returnVisitsQuery = usePersonReturnVisits({ personId: id })

const locationLink = computed(() => {
	if (!person.value) return ""

	if (!person.value.location) return ""

	const { latitude, longitude } = person.value.location

	if (!latitude || !longitude) return ""

	return `https://www.google.com/maps/search/${latitude},${longitude}`
})

const returnDay = computed<number | undefined>(
	() => returnVisitsQuery.data.value?.at(0)?.returnDate.getDay()
)

useTitle(
	computed(() =>
		[person.value?.name, route.meta.appName].filter(Boolean).join(" | ")
	)
)
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<template v-if="!person">
			<h1 class="text-3xl font-bold text-center">Error</h1>
		</template>
		<template v-else>
			<div class="flex justify-between flex-wrap gap-3">
				<h1 class="text-3xl font-bold">{{ person.name || "Sin nombre" }}</h1>

				<h2 class="text-2xl font-semibold">
					{{ person.colony }}
					<a
						v-if="locationLink"
						:href="locationLink"
						rel="noopener noreferrer"
						target="_blank"
						class="text-base bg-lemon-100 dark:bg-lemon-900"
					>
						(Ubicación)
					</a>
				</h2>
			</div>

			<span v-if="returnDay != undefined" class="underline text-sm">
				Volver el {{ DAYS[returnDay] }}
			</span>

			<p class="whitespace-pre-line">{{ person.description }}</p>

			<div class="text-right">
				<RouterLink
					:to="{ name: 'PeopleEdit', params: { id } }"
					class="underline bg-lemon-100 dark:bg-lemon-900"
				>
					Editar persona
				</RouterLink>
			</div>

			<hr class="h-0.5 bg-asparagus-600 my-3" />

			<section class="px-2 py-1">
				<div class="flex justify-between items-center">
					<h2 class="text-xl font-semibold">Revisitas</h2>

					<RouterLink
						:to="{ name: 'PeopleReturnVisitsCreate' }"
						class="underline bg-lemon-100 dark:bg-lemon-900"
						active-class="hidden"
					>
						Agregar revisita
					</RouterLink>
				</div>

				<router-view class="mt-6" />
			</section>
		</template>
	</main>
</template>
