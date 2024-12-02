<script setup lang="ts">
import { usePreviousUrl } from "@/composables/usePreviousUrl"

const previousUrl = usePreviousUrl()
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3 grid items-center h-full">
		<div class="space-y-10">
			<h1 class="text-center text-3xl font-bold">
				¡Ups! La página que intentas buscar no existe
			</h1>

			<RouterLink
				class="underline block w-fit mx-auto bg-lemon-100"
				:to="previousUrl"
			>
				{{ previousUrl === "/" ? "Inicio" : "Atrás" }}
			</RouterLink>
		</div>
	</main>
</template>
