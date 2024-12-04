<script setup lang="ts">
import { computed } from "vue"
import { RouterLink, RouterLinkProps } from "vue-router"

type Color = "asparagus" | "lemon" | "fawn" | "chili" | "rangoon"

const props = withDefaults(
	defineProps<{
		color?: Color | ""
		type?: HTMLButtonElement["type"]
		href?: HTMLAnchorElement["href"] | RouterLinkProps["to"]
		outlined?: boolean
		external?: boolean
		loading?: boolean
		disabled?: boolean
	}>(),
	{
		type: "button",
		color: "",
		outlined: false,
		external: false,
		loading: false,
		disabled: false,
	}
)

const isLink = computed(() => !!props.href)

const colorClasses: Record<Color | "", string> = {
	"": "",
	asparagus: "bg-asparagus-600 text-asparagus-50",
	lemon: "bg-lemon-600 text-lemon-50",
	fawn: "bg-fawn-600 text-fawn-50",
	chili: "",
	rangoon: "",
}
</script>

<template>
	<component
		:is="isLink ? (external ? 'a' : RouterLink) : 'button'"
		:class="[
			'button px-2 py-1 rounded',
			colorClasses[color],
			{ 'is-loading': loading },
			{ disabled: disabled || loading },
		]"
		:href="external ? href : undefined"
		:to="external ? undefined : href"
		:type="isLink ? undefined : type"
		:disabled="disabled || loading"
	>
		<slot />
	</component>
</template>
