<script setup lang="ts">
import { computed, ref } from "vue"
import { useQueries } from "@tanstack/vue-query"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { DAYS } from "@/constants"
import { personReturnVisitsQuery } from "@/return-visits/queries/personReturnVisitsQuery"
import VSelect from "@/components/form/VSelect.vue"
import VButton from "@/components/VButton.vue"
import { type ReturnVisit } from "@/return-visits/models/ReturnVisit"

const peopleQuery = usePeopleQuery()

const selectedDays = ref<number[]>([])
const selectedColonies = ref<string[]>([])

const showFilters = computed(() => {
	if (!peopleQuery.data.value?.length) return false

	return peopleQuery.data.value.length > 1
})

const returnVisitsQueries = useQueries({
	queries: computed(
		() =>
			peopleQuery.data.value?.map(({ id }) =>
				personReturnVisitsQuery(id, {
					select: (returnVisits) => returnVisits.slice(0, 1),
				}),
			) ?? [],
	),
})

const lastReturnVisits = computed(
	(): Record<number, ReturnVisit> =>
		Object.fromEntries(
			returnVisitsQueries.value
				.filter((returnVisits) => returnVisits.isSuccess)
				.map((returnVisits) => returnVisits.data.at(0))
				.filter((returnVisit): returnVisit is ReturnVisit =>
					Boolean(returnVisit),
				)
				.map((returnVisit) => [returnVisit.personId, returnVisit]),
		),
)

const days = computed(
	() =>
		new Set(
			Object.values(lastReturnVisits.value)
				.filter((returnVisit) => returnVisit?.returnDate)
				.map(({ returnDate }) => returnDate.getDay()),
		),
)

const colonies = computed(
	() => new Set(peopleQuery.data.value?.map(({ colony }) => colony)),
)

const people = computed(() =>
	peopleQuery.data.value
		?.filter((person) => {
			if (selectedDays.value.length) {
				if (!lastReturnVisits.value[person.id]) return false

				const returnDay = lastReturnVisits.value[person.id].returnDate.getDay()

				if (returnDay != undefined && !selectedDays.value.includes(returnDay))
					return false
			}

			if (selectedColonies.value.length) {
				if (!selectedColonies.value.includes(person.colony)) return false
			}

			return true
		})
		.toSorted((a, b) => {
			const returnVisitA = a ? lastReturnVisits.value[a.id] : null
			const returnVisitB = b ? lastReturnVisits.value[b.id] : null

			if (returnVisitA && returnVisitB)
				return (
					returnVisitB.returnDate.getTime() - returnVisitA.returnDate.getTime()
				)

			if (returnVisitA) return -1
			if (returnVisitB) return 1

			return 0
		}),
)

function resetForm() {
	selectedDays.value = []
	selectedColonies.value = []
}
</script>

<template>
	<div class="space-y-4">
		<form @reset="resetForm" class="space-y-2" v-if="showFilters">
			<div class="grid grid-cols-5 gap-3">
				<label class="flex flex-col gap-1 col-span-3">
					Colonia

					<VSelect
						id="selectedColonies"
						v-model="selectedColonies"
						multiple
						size="3"
					>
						<option v-for="colony in colonies" :key="colony" class="truncate">
							{{ colony }}
						</option>
					</VSelect>
				</label>

				<label class="flex flex-col gap-1 col-span-2">
					Día de vuelta

					<VSelect id="selectedDays" v-model="selectedDays" multiple size="3">
						<option
							v-for="day in days"
							class="first-letter:uppercase truncate"
							:value="day"
							:key="day"
						>
							{{ DAYS[day] }}
						</option>
					</VSelect>
				</label>
			</div>

			<div class="text-right">
				<VButton
					type="reset"
					color="asparagus"
					:disabled="!selectedDays.length && !selectedColonies.length"
				>
					Limpiar
				</VButton>
			</div>
		</form>

		<div
			class="max-w-full overflow-x-auto grid grid-cols-2 gap-3 sm:grid-cols-3"
		>
			<article
				v-for="person in people"
				:key="person.id"
				class="bg-asparagus-100 rounded p-2 flex flex-col"
			>
				<h2 class="text-lg font-bold">
					<RouterLink
						class="underline hover:text-asparagus-700 focus:text-asparagus-700"
						:to="`/people/${person.id}`"
					>
						{{ person.name || "Sin nombre" }}
					</RouterLink>
				</h2>

				<h3>{{ person.colony }}</h3>

				<small
					v-if="lastReturnVisits[person.id]?.returnDate.getDay() !== undefined"
				>
					Volver el {{ DAYS[lastReturnVisits[person.id].returnDate.getDay()] }}
				</small>

				<p class="mt-5 whitespace-pre-line">{{ person.description }}</p>
			</article>
		</div>
	</div>
</template>
