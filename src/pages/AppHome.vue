<script setup lang="ts">
import PeopleList from "@people/components/PeopleList.vue"
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<section class="space-y-4">
			<div class="flex gap-3 items-center">
				<h1 class="text-3xl font-display">Revisitas</h1>

				<img
					src="/favicon.webp"
					class="min-h-0 h-10"
					alt="Libretita de colores"
				/>
			</div>

			<PeopleList />

			<div class="inline-block fixed bottom-4 right-5">
				<router-link
					:to="{ name: 'PeopleCreate' }"
					class="inline-block underline bg-lemon-100"
				>
					Agregar persona
				</router-link>
			</div>
		</section>
	</main>
</template>
