<script setup lang="ts">
import { HTMLAttributes, InputHTMLAttributes } from "vue"
import VInputErrors from "./VInputErrors.vue"

defineOptions({ inheritAttrs: false })

withDefaults(
	defineProps<{
		id: string
		type?: InputHTMLAttributes["type"]
		divClass?: HTMLAttributes["class"]
		hideErrors?: boolean
	}>(),
	{
		type: "text",
	}
)

const model = defineModel()
const errors = defineModel<string>("errors")
</script>

<template>
	<div :class="divClass">
		<input
			v-bind="$attrs"
			:id="id"
			:name="id"
			:type="type"
			:class="[
				'border rounded-sm h-8 block px-2 py-1 w-full max-w-full dark:text-lemon-50',
				errors
					? 'border-chili-400 accent-chili-600'
					: 'border-asparagus-100 accent-asparagus-600',
			]"
			v-model="model"
			@change="errors = ''"
		/>

		<VInputErrors v-if="!hideErrors" :errors="errors" />
	</div>
</template>
