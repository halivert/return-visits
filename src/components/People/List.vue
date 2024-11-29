<script setup lang="ts">
import { computed, ref } from "vue"
import usePeopleQuery from "../../queries/people/usePeople"

const peopleQuery = usePeopleQuery()

const DAYS = [
	"domingo",
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
] as const

const selectedDays = ref<number[]>([])
const selectedColonies = ref<string[]>([])

const days = computed(
	() => new Set(peopleQuery.data.value?.map(({ returnDay }) => returnDay))
)

const colonies = computed(
	() => new Set(peopleQuery.data.value?.map(({ colony }) => colony))
)

const people = computed(
	() =>
		peopleQuery.data.value?.filter((people) => {
			if (selectedDays.value.length) {
				if (!selectedDays.value.includes(people.returnDay)) return false
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
		<form @reset="resetForm" class="space-y-2">
			<div class="grid grid-cols-2 gap-3">
				<label class="flex flex-col gap-1">
					Colonia

					<select
						class="dark:text-lemon-50"
						name="selectedColonies"
						v-model="selectedColonies"
						multiple
						size="2"
					>
						<option v-for="colony in colonies" :key="colony">
							{{ colony }}
						</option>
					</select>
				</label>

				<label class="flex flex-col gap-1">
					Día de vuelta

					<select
						class="dark:text-lemon-50"
						name="selectedDays"
						v-model="selectedDays"
						multiple
						size="2"
					>
						<option
							v-for="day in days"
							class="first-letter:uppercase"
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
				class="bg-asparagus-100 rounded p-2 flex flex-col"
			>
				<h2 class="text-lg font-bold">{{ person.name }}</h2>

				<h3>{{ person.colony }}</h3>

				<small>Volver el {{ DAYS[person.returnDay] }}</small>

				<p class="mt-5">
					{{ person.description }}
				</p>
			</article>
		</div>
	</div>
</template>
