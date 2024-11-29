<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue"
</script>

<template>
	<div class="h-dvh overflow-y-scroll bg-lemon-50 text-rangoon-950">
		<router-view></router-view>
	</div>
	<PWABadge />
</template>
