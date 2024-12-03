<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useGeolocation } from "@vueuse/core"
import { useAddPeople } from "@/people/queries/useAddPeople"
import { useColonies } from "@/people/composables/useColonies"
import { useAvailableTopics } from "@/return-visits/composables/useAvailableTopics"
import {
	getDateForInput,
	getTimeForInput,
} from "@/return-visits/composables/getDateTimeForInput"

const router = useRouter()
const colonies = useColonies()
const geolocation = useGeolocation({ immediate: false })
const availableTopics = useAvailableTopics()

const addPersonMutation = useAddPeople()

const errors = ref<Record<string, string>>({})

const now = new Date()

const addPersonForm = reactive({
	name: "",
	colony: "",
	description: "",
	addLocation: false,

	// Return visit data
	date: getDateForInput(now),
	time: getTimeForInput(now),
	topic: "",
	returnDate: getDateForInput(
		new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7)
	),
	returnTime: getTimeForInput(now),
	notes: "",
})

async function addPerson(coords?: Omit<GeolocationCoordinates, "toJSON">) {
	if (Object.values(errors.value).some((error) => error)) return

	try {
		await addPersonMutation.mutateAsync({
			person: {
				name: addPersonForm.name,
				colony: addPersonForm.colony,
				description: addPersonForm.description,
				location: coords
					? {
							longitude: coords.longitude,
							latitude: coords.latitude,
							altitude: coords.altitude,
					  }
					: undefined,
			},
			returnVisit: {
				date: new Date(addPersonForm.date + "T" + addPersonForm.time),
				topic: addPersonForm.topic,
				returnDate: new Date(
					addPersonForm.returnDate + "T" + addPersonForm.returnTime
				),
				notes: addPersonForm.notes,
			},
		})

		router.replace("/")
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
	}
}

function handleSubmit() {
	if (addPersonMutation.isPending.value) return

	if (!addPersonForm.name) {
		errors.value = { ...errors.value, name: "Falta nombre" }
	}

	if (!addPersonForm.colony) {
		errors.value = { ...errors.value, colony: "Falta colonia" }
	}

	if (!addPersonForm.date) {
		errors.value = { ...errors.value, date: "Falta fecha" }
	}

	if (!addPersonForm.time) {
		errors.value = { ...errors.value, time: "Falta hora" }
	}

	if (!addPersonForm.topic) {
		errors.value = { ...errors.value, topic: "Falta tema" }
	}

	if (!addPersonForm.returnDate) {
		errors.value = { ...errors.value, returnDate: "Falta fecha de revisita" }
	}

	if (!addPersonForm.returnTime) {
		errors.value = { ...errors.value, returnTime: "Falta hora de revisita" }
	}

	const date = new Date(addPersonForm.date + "T" + addPersonForm.time)
	const returnDate = new Date(
		addPersonForm.returnDate + "T" + addPersonForm.returnTime
	)

	if (date.getTime() > returnDate.getTime()) {
		errors.value = {
			...errors.value,
			returnDate: "Fecha de revisita tiene que ser posterior a fecha de visita",
		}
	}

	if (addPersonForm.addLocation) {
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

				addPerson(coords)
			},
			{ once: true }
		)

		return
	}

	addPerson()
}
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<h1 class="text-3xl font-bold mb-4">Agregar persona</h1>

		<form class="grid grid-cols-3 gap-2 gap-y-3" @submit.prevent="handleSubmit">
			<label class="text-right" for="name">Nombre</label>

			<div class="col-span-2">
				<input
					id="name"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'h-8 w-full',
						errors['name']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					type="text"
					name="name"
					v-model="addPersonForm.name"
					placeholder="Saulo"
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
						'h-8 w-full',
						errors['colony']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					type="text"
					name="colony"
					list="colonyList"
					v-model="addPersonForm.colony"
					placeholder="Tarso"
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
					v-model="addPersonForm.addLocation"
				/>

				<small class="text-chili-600" v-if="errors['location']">
					{{ errors["location"] }}
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
					v-model="addPersonForm.description"
					:placeholder="
						[
							'Calle Recta, casa de Judas.\n',
							'Israelita de la tribu de Benjamín',
							'Estaba orando, no puede ver.',
						].join('\n')
					"
					maxlength="250"
				></textarea>

				<small class="text-chili-600" v-if="errors['description']">
					{{ errors["description"] }}
				</small>
			</div>

			<div class="text-right">
				<label for="date">Fecha</label>
				y
				<label for="time">hora</label>
			</div>

			<div class="col-span-2">
				<div class="flex flex-wrap gap-2">
					<input
						id="date"
						:class="[
							'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
							'h-8 flex-1',
							errors['date']
								? 'border-chili-400 accent-chili-600'
								: 'border-asparagus-100 accent-asparagus-600',
						]"
						type="date"
						name="date"
						v-model="addPersonForm.date"
						@input="errors['date'] = ''"
						required
					/>

					<input
						id="time"
						:class="[
							'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
							'h-8 flex-1',
							errors['time']
								? 'border-chili-400 accent-chili-600'
								: 'border-asparagus-100 accent-asparagus-600',
						]"
						type="time"
						name="time"
						v-model="addPersonForm.time"
						@input="errors['time'] = ''"
						required
					/>
				</div>
				<small class="text-chili-600" v-if="errors['date'] || errors['time']">
					{{ errors["date"] }} <br v-if="errors['date'] && errors['time']" />
					{{ errors["time"] }}
				</small>
			</div>

			<label class="text-right" for="topic">Tema</label>

			<div class="col-span-2">
				<input
					id="topic"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'h-8 w-full',
						errors['topic']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					type="string"
					name="topic"
					v-model="addPersonForm.topic"
					@input="errors['topic'] = ''"
					list="topicDataList"
					placeholder="Visitar para devolver la vista"
					required
				/>

				<small class="text-chili-600" v-if="errors['topic']">
					{{ errors["topic"] }}
				</small>

				<datalist id="topicDataList">
					<option v-for="topic in availableTopics" :key="topic">
						{{ topic }}
					</option>
				</datalist>
			</div>

			<div class="text-right">
				<label for="returnDate">Fecha</label>
				y
				<label for="returnTime">hora</label>
				de revisita
			</div>

			<div class="col-span-2">
				<div class="flex flex-wrap gap-2">
					<input
						id="returnDate"
						:class="[
							'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
							'h-8 flex-1',
							errors['returnDate']
								? 'border-chili-400 accent-chili-600'
								: 'border-asparagus-100 accent-asparagus-600',
						]"
						type="date"
						name="returnDate"
						v-model="addPersonForm.returnDate"
						:min="addPersonForm.date"
						@change="errors['returnDate'] = ''"
						required
					/>

					<input
						id="returnTime"
						:class="[
							'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
							'h-8 flex-1',
							errors['returnTime']
								? 'border-chili-400 accent-chili-600'
								: 'border-asparagus-100 accent-asparagus-600',
						]"
						type="time"
						name="returnTime"
						v-model="addPersonForm.returnTime"
						@input="errors['returnTime'] = ''"
						required
					/>
				</div>
				<small
					class="text-chili-600"
					v-if="errors['returnDate'] || errors['returnTime']"
				>
					{{ errors["returnDate"] }}
					<br v-if="errors['returnDate'] && errors['returnTime']" />
					{{ errors["returnTime"] }}
				</small>
			</div>

			<label class="text-right" for="notes">Notas</label>

			<div class="col-span-2">
				<textarea
					id="notes"
					:class="[
						'block dark:text-lemon-50 px-2 py-1 max-w-full rounded-sm border',
						'resize-y min-h-16 max-h-72 w-full',
						errors['notes']
							? 'border-chili-400 accent-chili-600'
							: 'border-asparagus-100 accent-asparagus-600',
					]"
					name="notes"
					v-model="addPersonForm.notes"
					:placeholder="
						[
							'Jesucristo me envió, no tengo muchas ganas de ir porque este hombre le ha hecho mucho daño a los santos en Jerusalén.\n',
							'Jesús dice que es un instrumento para llevar su nombre a las naciones.',
						].join('\n')
					"
					rows="10"
					maxlength="500"
				></textarea>

				<small class="text-chili-600" v-if="errors['notes']">
					{{ errors["notes"] }}
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
