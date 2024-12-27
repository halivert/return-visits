<script setup lang="ts">
import PeopleList from "@/people/components/PeopleList.vue"
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<section class="space-y-4">
			<div class="text-right">
				<RouterLink
					:to="{ name: 'PeopleCreate' }"
					class="underline bg-lemon-100 dark:bg-lemon-900"
				>
					Agregar persona
				</RouterLink>
			</div>

			<PeopleList />
		</section>
	</main>
</template>
