<script setup lang="ts">
import { computed } from "vue"
import { RouterLink, RouterLinkProps } from "vue-router"

type Color = "asparagus" | "lemon" | "fawn" | "chili" | "rangoon" | "white"

const props = withDefaults(
	defineProps<{
		color?: Color
		isOutlined?: boolean
		href?: HTMLAnchorElement["href"] | RouterLinkProps["to"]
	}>(),
	{
		color: "white",
		isOutlined: false,
	}
)

const isLink = computed(() => !!props.href)
const isExternal = computed(
	() => typeof props.href === "string" && props.href.startsWith("http")
)

const colorClasses: Record<Color, string> = {
	asparagus: "bg-asparagus-600 text-asparagus-50",
	lemon: "",
	fawn: "bg-fawn-600 text-fawn-50",
	chili: "",
	rangoon: "",
	white: "",
}
</script>

<template>
	<component
		:is="isLink ? (isExternal ? 'a' : RouterLink) : 'button'"
		:class="[
			'px-2 py-1 rounded disabled:cursor-not-allowed disabled:opacity-60',
			colorClasses[color],
		]"
		:href="isExternal ? href : undefined"
		:to="isExternal ? undefined : href"
	>
		<slot />
	</component>
</template>
