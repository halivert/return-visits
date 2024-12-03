<script setup lang="ts">
import { computed } from "vue"
import { usePersonReturnVisits } from "@/return-visits/queries/usePersonReturnVisits"

const props = defineProps<{
	id: number
}>()

const personId = computed(() => props.id)

const returnVisitsQuery = usePersonReturnVisits({ personId })

const returnVisits = computed(() => returnVisitsQuery.data.value)

function getDatetime(date: Date) {
	return Intl.DateTimeFormat("es-MX", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date)
}

function getUrlDate(date: Date) {
	return encodeURIComponent(date.toISOString().split(":00.")[0])
}
</script>

<template>
	<div class="flex flex-col gap-4" v-if="returnVisits">
		<article
			v-for="returnVisit in returnVisits"
			:key="`${returnVisit.personId}-${returnVisit.date.toISOString()}`"
			class="border p-2 bg-asparagus-200 rounded"
		>
			<h2 class="text-xl font-semibold">
				<RouterLink
					class="text-asparagus-800 underline"
					:to="{
						name: 'PeopleReturnVisitsEdit',
						params: {
							id: personId,
							date: getUrlDate(returnVisit.date),
						},
					}"
				>
					{{ returnVisit.topic }}
				</RouterLink>
			</h2>

			<div class="flex justify-between flex-wrap">
				<p>
					<strong>
						{{ getDatetime(returnVisit.date) }}
					</strong>
				</p>

				<p>
					Volver:
					<strong>
						{{ getDatetime(returnVisit.returnDate) }}
					</strong>
				</p>
			</div>

			<p v-if="returnVisit.notes" class="text-sm mt-3 whitespace-pre">
				{{ returnVisit.notes }}
			</p>
		</article>
	</div>
</template>
