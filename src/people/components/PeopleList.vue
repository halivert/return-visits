<script setup lang="ts">
import { computed, ref } from "vue"
import { useQueries } from "@tanstack/vue-query"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { DAYS } from "@/constants"
import { personReturnVisitsQuery } from "@/return-visits/queries/personReturnVisitsQuery"
import VSelect from "@/components/form/VSelect.vue"
import VButton from "@/components/VButton.vue"

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
			peopleQuery.data.value?.map(({ id }) => personReturnVisitsQuery(id)) ?? []
	),
})

const days = computed(
	() =>
		new Set(
			returnVisitsQueries.value
				.flatMap(({ data }) => data?.at(0)?.returnDate.getDay())
				.filter((day) => day != undefined)
		)
)

const returnDays = computed<Record<number, number | undefined>>(() =>
	Object.fromEntries(
		returnVisitsQueries.value
			.filter(({ data }) => !!data?.at(0)?.personId)
			.map(({ data }) => [
				data?.at(0)?.personId,
				data?.at(0)?.returnDate.getDay(),
			])
	)
)

const colonies = computed(
	() => new Set(peopleQuery.data.value?.map(({ colony }) => colony))
)

const people = computed(
	() =>
		peopleQuery.data.value?.filter((person) => {
			if (selectedDays.value.length) {
				const returnDay = returnDays.value[person.id]

				if (returnDay != undefined && !selectedDays.value.includes(returnDay))
					return false
			}

			if (selectedColonies.value.length) {
				if (!selectedColonies.value.includes(person.colony)) return false
			}

			return true
		})
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

				<small v-if="returnDays[person.id] !== undefined">
					Volver el {{ DAYS[returnDays[person.id] as number] }}
				</small>

				<p class="mt-5 whitespace-pre-line">{{ person.description }}</p>
			</article>
		</div>
	</div>
</template>
