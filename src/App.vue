<script setup lang="ts">
import PWABadge from "@/components/PWABadge.vue"
</script>

<template>
	<div class="h-dvh overflow-y-scroll bg-lemon-50 text-rangoon-950">
		<header class="max-w-prose mx-auto py-2 px-3">
			<RouterLink
				class="inline-flex gap-3 items-center hover:underline hover:text-asparagus-700 focus:text-asparagus-700"
				:to="{ name: 'Home' }"
			>
				<span class="text-3xl font-display">Revisitas</span>

				<img
					src="/favicon.webp"
					class="min-h-0 h-10"
					alt="Libretita de colores"
				/>
			</RouterLink>
		</header>
		<router-view></router-view>
	</div>
	<PWABadge />
</template>
