<script setup lang="ts">
import { computed, HTMLAttributes, InputHTMLAttributes } from "vue"
import VInputErrors from "@/components/form/VInputErrors.vue"

defineOptions({ inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		id: string
		type?: InputHTMLAttributes["type"]
		divClass?: HTMLAttributes["class"]
		hideErrors?: boolean
		list?: Iterable<string>
	}>(),
	{
		type: "text",
	}
)

const model = defineModel()
const errors = defineModel<string>("errors")

const isInline = computed(() => ["checkbox", "radio"].includes(props.type))
</script>

<template>
	<div :class="divClass">
		<input
			:name="id"
			v-bind="$attrs"
			:id="id"
			:type="type"
			:class="[
				'border rounded-sm h-8 block px-2 py-1 dark:text-lemon-50',
				{ 'w-full max-w-full': !isInline },
				errors
					? 'border-chili-400 accent-chili-600'
					: 'border-asparagus-100 accent-asparagus-600',
			]"
			v-model="model"
			:list="list ? `${id}List` : undefined"
			@change="errors = ''"
		/>

		<datalist v-if="list" :id="`${id}List`">
			<option v-for="item in list" :key="item">
				{{ item }}
			</option>
		</datalist>

		<VInputErrors v-if="!hideErrors" :errors="errors" />
	</div>
</template>
