<script setup lang="ts">
import PeopleList from "@/people/components/PeopleList.vue"
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<section class="space-y-4">
			<PeopleList />

			<div class="inline-block fixed bottom-4 right-5">
				<RouterLink
					:to="{ name: 'PeopleCreate' }"
					class="inline-block underline bg-lemon-100"
				>
					Agregar persona
				</RouterLink>
			</div>
		</section>
	</main>
</template>
