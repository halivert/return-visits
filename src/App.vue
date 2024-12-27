<script setup lang="ts">
import PWABadge from "@/components/PWABadge.vue"
import AppNav from "@/components/AppNav.vue"
</script>

<template>
	<div
		class="h-dvh overflow-y-scroll bg-rangoon-50 text-rangoon-950 dark:bg-rangoon-950 dark:text-rangoon-50"
	>
		<AppNav />
		<RouterView />
	</div>
	<PWABadge />
</template>
