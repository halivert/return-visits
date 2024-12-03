<script setup lang="ts">
import VInputErrors from "./VInputErrors.vue"

defineOptions({ inheritAttrs: false })

withDefaults(
	defineProps<{
		divClass?: string
		id: string
	}>(),
	{}
)

const model = defineModel<string>()
const errors = defineModel<string>("errors")
</script>

<template>
	<div :class="divClass">
		<textarea
			rows="10"
			maxlength="500"
			v-bind="$attrs"
			:id="id"
			:name="id"
			:class="[
				'block px-2 py-1 max-w-full rounded-sm border w-full dark:text-lemon-50',
				errors
					? 'border-chili-400 accent-chili-600'
					: 'border-asparagus-100 accent-asparagus-600',
			]"
			v-model="model"
			@change="errors = ''"
		></textarea>

		<VInputErrors :errors="errors" />
	</div>
</template>
