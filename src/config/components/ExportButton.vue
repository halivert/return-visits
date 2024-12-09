<script setup lang="ts">
import { computed } from "vue"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { useReturnVisits } from "@/return-visits/queries/useReturnVisits"
import { Person } from "@/db/models/Person"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import VButton, { Color } from "@/components/VButton.vue"

interface Data {
	people: Person[]
	returnVisits: ReturnVisit[]
}

withDefaults(
	defineProps<{
		color?: Color
	}>(),
	{
		color: "asparagus",
	},
)

const peopleQuery = usePeopleQuery()
const returnVisitsQuery = useReturnVisits()

const fileName = computed(() => {
	return new Date().toISOString() + ".return-visits"
})

const url = computed(() => {
	if (peopleQuery.isLoading.value || returnVisitsQuery.isLoading.value) {
		return undefined
	}

	const data: Data = {
		people: peopleQuery.data.value ?? [],
		returnVisits: returnVisitsQuery.data.value ?? [],
	}

	const blob = new Blob([JSON.stringify(data)], { type: "application/json" })

	return URL.createObjectURL(blob)
})
</script>

<template>
	<VButton :color="color" :href="url" :download="fileName" external>
		<slot />
	</VButton>
</template>
