<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useGeolocation } from "@vueuse/core"
import usePeopleQuery from "../../queries/people/usePeople"
import { useAddPeople } from "../../queries/people/useAddPeople"

const DAYS = [
	"domingo",
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
] as const

const todayDay = computed(() => new Date().getDay())

const router = useRouter()

const peopleQuery = usePeopleQuery()

const addPersonMutation = useAddPeople()

const colonies = computed(
	() => new Set(peopleQuery.data.value?.map(({ colony }) => colony))
)

const geolocation = useGeolocation({ immediate: false })

const errors = ref<Record<string, string>>({})

async function addPerson(
	data: Record<string, FormDataEntryValue>,
	coords?: Omit<GeolocationCoordinates, "toJSON">
) {
	if (Object.values(errors.value).some((error) => error)) return

	try {
		await addPersonMutation.mutateAsync({
			colony: data.colony as string,
			returnDay: parseInt(data.returnDay as string, 10),
			description: data.description as string,
			name: data.name as string,
			location: coords
				? {
						longitude: coords.longitude,
						latitude: coords.latitude,
						altitude: coords.altitude,
				  }
				: undefined,
		})

		router.replace("/")
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
	}
}

function handleSubmit(event: Event) {
	if (addPersonMutation.isPending.value) return

	const form = event.target as HTMLFormElement

	const data = Object.fromEntries(new FormData(form))

	if (!data.name) {
		errors.value = { ...errors.value, name: "Falta nombre" }
	}

	if (!data.colony) {
		errors.value = { ...errors.value, colony: "Falta colonia" }
	}

	if (data.location) {
		geolocation.resume()

		watch(
			[geolocation.coords, geolocation.error],
			([coords, error]) => {
				if (error) {
					errors.value = {
						...errors.value,
						location: "Error obteniendo la ubicación",
					}

					return
				}

				addPerson(data, coords)
			},
			{ once: true }
		)

		return
	}

	addPerson(data)
}
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<h1 class="text-3xl font-bold mb-4">Nueva persona</h1>

		<form class="grid grid-cols-3 gap-2 gap-y-3" @submit.prevent="handleSubmit">
			<label class="text-right" for="name">Nombre</label>

			<div class="col-span-2">
				<input
					id="name"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'h-8',
						errors['name']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					type="text"
					name="name"
					@input="errors['name'] = ''"
					required
				/>

				<small class="text-chili-600" v-if="errors['name']">
					{{ errors["name"] }}
				</small>
			</div>

			<label class="text-right" for="colony">Colonia</label>

			<div class="col-span-2">
				<input
					id="colony"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'h-8',
						errors['colony']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					type="text"
					name="colony"
					list="colonyList"
					@input="errors['colony'] = ''"
					required
				/>

				<small class="text-chili-600" v-if="errors['colony']">
					{{ errors["colony"] }}
				</small>

				<datalist id="colonyList">
					<option v-for="colony in colonies" :key="colony">{{ colony }}</option>
				</datalist>
			</div>

			<label class="text-right" for="returnDay">Día de revisita</label>

			<div class="col-span-2">
				<select
					id="returnDay"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'w-full text-base h-8',
						errors['returnDay']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					name="returnDay"
					:value="todayDay"
					required
				>
					<option
						v-for="(day, i) in DAYS"
						:value="i"
						:key="i"
						class="inline-block first-letter:uppercase"
					>
						{{ day }}
					</option>
				</select>

				<small class="text-chili-600" v-if="errors['returnDay']">
					{{ errors["returnDay"] }}
				</small>
			</div>

			<label class="text-right" for="description">Descripción</label>

			<div class="col-span-2">
				<textarea
					id="description"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'resize-y min-h-16 max-h-72 w-full',
						errors['description']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					rows="8"
					name="description"
					maxlength="250"
				></textarea>

				<small class="text-chili-600" v-if="errors['description']">
					{{ errors["description"] }}
				</small>
			</div>

			<label class="text-right" for="location">Ubicación</label>

			<div class="col-span-2 self-center">
				<input
					type="checkbox"
					id="location"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm',
						errors['location']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					name="location"
				/>

				<small class="text-chili-600" v-if="errors['location']">
					{{ errors["location"] }}
				</small>
			</div>

			<button
				class="col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50"
				type="submit"
				:disabled="addPersonMutation.isPending.value"
			>
				Guardar
			</button>
		</form>
	</main>
</template>
