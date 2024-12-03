<script setup lang="ts">
import { HTMLAttributes } from "vue"
import VInputErrors from "@/components/form/VInputErrors.vue"

defineOptions({ inheritAttrs: false })

defineProps<{
	divClass?: HTMLAttributes["class"]
	id: string
	hideErrors?: boolean
	multiple?: boolean
}>()

const model = defineModel()
const errors = defineModel<string>("errors")
</script>

<template>
	<div :class="divClass">
		<select
			v-bind="$attrs"
			:id="id"
			:name="id"
			:class="[
				'w-full px-2 py-1 border dark:text-lemon-50',
				{ 'h-8': !multiple },
				errors
					? 'border-chili-400 accent-chili-600'
					: 'border-asparagus-100 accent-asparagus-600',
			]"
			:multiple="multiple"
			v-model="model"
			@change="errors = ''"
		>
			<slot />
		</select>

		<VInputErrors v-if="!hideErrors" :errors="errors" />
	</div>
</template>
