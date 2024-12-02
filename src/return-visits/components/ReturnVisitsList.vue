<script setup lang="ts">
import { computed } from "vue"
import { usePersonReturnVisits } from "@return-visits/queries/usePersonReturnVisits"

const props = defineProps<{
	id: number
}>()

const id = computed(() => props.id)

const returnVisitsQuery = usePersonReturnVisits({ personId: id })

const returnVisits = computed(
	() =>
		returnVisitsQuery.data.value?.toSorted((a, b) => {
			return b.date.getTime() - a.date.getTime()
		})
)

function getDatetime(date: Date) {
	return Intl.DateTimeFormat("es-MX", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date)
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
					:to="{
						name: 'ReturnVisitsShow',
						params: {
							id: id,
						},
					}"
				>
					{{ returnVisit.topic }}
				</RouterLink>
			</h2>

			<div class="flex justify-between">
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

			<p v-if="returnVisit.notes" class="text-sm mt-3">
				{{ returnVisit.notes }}
			</p>
		</article>
	</div>
</template>
