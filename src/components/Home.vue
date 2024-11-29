<script setup lang="ts">
import PeopleList from "./People/List.vue"
</script>

<template>
	<div class="h-dvh overflow-y-scroll bg-lemon-50 text-rangoon-950">
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

				<button class="border bg-asparagus-500 px-3 py-1 rounded">
					Create
				</button>
			</section>
		</main>
	</div>
</template>
