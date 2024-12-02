<script setup lang="ts">
defineProps<{
	id: number
	date: Date
}>()
</script>

<template>
	<div>
		{{ id }}
		{{ date }}
	</div>
</template>
