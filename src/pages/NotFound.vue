<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const previousPage = computed(() => {
	const lastPath = router.options.history.state.back
	return typeof lastPath === "string" ? lastPath : "/"
})
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3 grid items-center h-full">
		<div class="space-y-10">
			<h1 class="text-center text-3xl font-bold">
				¡Ups! La página que intentas buscar no existe
			</h1>

			<router-link
				class="underline block w-fit mx-auto bg-lemon-100"
				:to="previousPage"
			>
				{{ previousPage === "/" ? "Inicio" : "Atrás" }}
			</router-link>
		</div>
	</main>
</template>
