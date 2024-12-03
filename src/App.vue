<script setup lang="ts">
import PWABadge from "@/components/PWABadge.vue"
import AppNav from "@/components/AppNav.vue"
</script>

<template>
	<div class="h-dvh overflow-y-scroll bg-lemon-50 text-rangoon-950">
		<AppNav />
		<RouterView />
	</div>
	<PWABadge />
</template>
