<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
	errors?: string | (string | undefined)[]
}>()

const normalErrors = computed(
	() =>
		new Set(
			(Array.isArray(props.errors) ? props.errors : [props.errors]).filter(
				Boolean
			)
		)
)
</script>

<template>
	<small class="text-chili-600" v-if="normalErrors.size">
		<template v-for="(error, i) in normalErrors" :key="error">
			{{ error }}
			<br v-if="i < normalErrors.size - 1" />
		</template>
	</small>
</template>
