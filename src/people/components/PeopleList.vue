<script setup lang="ts">
import { computed, ref } from "vue"
import { usePeopleQuery } from "@people/queries/usePeople"
import { DAYS } from "@/constants"

const peopleQuery = usePeopleQuery()

const selectedDays = ref<number[]>([])
const selectedColonies = ref<string[]>([])

const showFilters = computed(() => {
	if (!peopleQuery.data.value?.length) return false

	return peopleQuery.data.value.length > 1
})

const days = computed(() => [])

const colonies = computed(
	() => new Set(peopleQuery.data.value?.map(({ colony }) => colony))
)

const people = computed(
	() =>
		peopleQuery.data.value?.filter((people) => {
			if (selectedDays.value.length) {
				// if (!selectedDays.value.includes(people.returnDay)) return false
			}

			if (selectedColonies.value.length) {
				if (!selectedColonies.value.includes(people.colony)) return false
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

					<select
						class="block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border w-full text-base"
						name="selectedColonies"
						v-model="selectedColonies"
						multiple
						size="2"
					>
						<option v-for="colony in colonies" :key="colony" class="truncate">
							{{ colony }}
						</option>
					</select>
				</label>

				<label class="flex flex-col gap-1 col-span-2">
					Día de vuelta

					<select
						class="block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border w-full text-base"
						name="selectedDays"
						v-model="selectedDays"
						multiple
						size="2"
					>
						<option
							v-for="day in days"
							class="first-letter:uppercase truncate"
							:value="day"
							:key="day"
						>
							{{ DAYS[day] }}
						</option>
					</select>
				</label>
			</div>

			<div class="text-right">
				<button
					type="reset"
					class="px-2 py-1 rounded bg-asparagus-600 text-lemon-50 disabled:cursor-not-allowed disabled:grayscale"
					:disabled="!selectedDays && !selectedColonies"
				>
					Limpiar
				</button>
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
					<router-link
						class="underline hover:text-asparagus-700 focus:text-asparagus-700"
						:to="`/people/${person.id}`"
					>
						{{ person.name || "Sin nombre" }}
					</router-link>
				</h2>

				<h3>{{ person.colony }}</h3>

				<!-- <small>Volver el {{ DAYS[person.returnDay] }}</small> -->

				<p class="mt-5">
					{{ person.description }}
				</p>
			</article>
		</div>
	</div>
</template>
