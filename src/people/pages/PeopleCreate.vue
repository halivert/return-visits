<script setup lang="ts">
import { watch } from "vue"
import { useRouter } from "vue-router"
import { useGeolocation } from "@vueuse/core"
import { useAddPeople } from "@/people/queries/useAddPeople"
import { useColonies } from "@/people/composables/useColonies"
import { useAvailableTopics } from "@/return-visits/composables/useAvailableTopics"
import {
	getDateForInput,
	getTimeForInput,
} from "@/return-visits/composables/getDateTimeForInput"
import { useForm } from "@/components/form/useForm"
import VInput from "@/components/form/VInput.vue"
import VTextarea from "@/components/form/VTextarea.vue"
import VInputErrors from "@/components/form/VInputErrors.vue"
import VButton from "@/components/VButton.vue"

const router = useRouter()
const colonies = useColonies()
const geolocation = useGeolocation({ immediate: false })
const availableTopics = useAvailableTopics()

const addPersonMutation = useAddPeople()

const now = new Date()

const addPersonForm = useForm({
	name: "",
	colony: "",
	description: "",
	addLocation: false,
	location: undefined,

	// Return visit data
	date: getDateForInput(now),
	time: getTimeForInput(now),
	topic: "",
	returnDate: getDateForInput(
		new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
	),
	returnTime: getTimeForInput(now),
	notes: "",
})

async function addPerson(coords?: Omit<GeolocationCoordinates, "toJSON">) {
	if (addPersonMutation.isPending.value) return
	if (Object.values(addPersonForm.errors).some(Boolean)) return

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
					addPersonForm.returnDate + "T" + addPersonForm.returnTime,
				),
				notes: addPersonForm.notes,
			},
		})

		router.back()
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
	}
}

function handleSubmit() {
	if (addPersonMutation.isPending.value) return

	if (!addPersonForm.name) {
		addPersonForm.errors.name = "Falta nombre"
	}

	if (!addPersonForm.colony) {
		addPersonForm.errors.colony = "Falta colonia"
	}

	if (!addPersonForm.date) {
		addPersonForm.errors.date = "Falta fecha"
	}

	if (!addPersonForm.time) {
		addPersonForm.errors.time = "Falta hora"
	}

	if (!addPersonForm.topic) {
		addPersonForm.errors.topic = "Falta tema"
	}

	if (!addPersonForm.returnDate) {
		addPersonForm.errors.returnDate = "Falta fecha de revisita"
	}

	if (!addPersonForm.returnTime) {
		addPersonForm.errors.returnTime = "Falta hora de revisita"
	}

	const date = new Date(addPersonForm.date + "T" + addPersonForm.time)
	const returnDate = new Date(
		addPersonForm.returnDate + "T" + addPersonForm.returnTime,
	)

	if (date.getTime() > returnDate.getTime()) {
		addPersonForm.errors.returnDate =
			"Fecha de revisita tiene que ser posterior a fecha de visita"
	}

	if (addPersonForm.addLocation) {
		geolocation.resume()

		watch(
			[geolocation.coords, geolocation.error],
			([coords, error]) => {
				if (error) {
					addPersonForm.errors.location = "Error obteniendo la ubicación"

					return
				}

				addPerson(coords)
			},
			{ once: true },
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

			<VInput
				id="name"
				div-class="col-span-2"
				v-model="addPersonForm.name"
				v-model:errors="addPersonForm.errors.name"
				placeholder="Saulo"
				required
			/>

			<label class="text-right" for="colony">Colonia</label>

			<VInput
				id="colony"
				div-class="col-span-2"
				v-model="addPersonForm.colony"
				v-model:errors="addPersonForm.errors.colony"
				:list="colonies"
				placeholder="Tarso"
				required
			/>

			<label class="text-right" for="location">Ubicación</label>

			<VInput
				id="location"
				div-class="col-span-2 self-center"
				type="checkbox"
				v-model="addPersonForm.addLocation"
				v-model:errors="addPersonForm.errors.location"
			/>

			<label class="text-right" for="description">
				Dirección y descripción
			</label>

			<VTextarea
				id="description"
				div-class="col-span-2"
				class="resize-y min-h-16 max-h-72"
				v-model="addPersonForm.description"
				v-model:errors="addPersonForm.errors.description"
				:placeholder="
					[
						'Calle Recta, casa de Judas.\n',
						'Israelita de la tribu de Benjamín',
						'Estaba orando, no puede ver.',
					].join('\n')
				"
				rows="8"
				maxlength="250"
			/>

			<div class="text-right">
				<label for="date">Fecha</label>
				y
				<label for="time">hora</label>
			</div>

			<div class="col-span-2">
				<div class="flex flex-wrap gap-2">
					<VInput
						id="date"
						div-class="flex-1"
						type="date"
						v-model="addPersonForm.date"
						v-model:errors="addPersonForm.errors.date"
						hide-errors
						required
					/>

					<VInput
						id="time"
						div-class="flex-1"
						type="time"
						v-model="addPersonForm.time"
						v-model:errors="addPersonForm.errors.time"
						hide-errors
						required
					/>
				</div>

				<VInputErrors
					:errors="[addPersonForm.errors.date, addPersonForm.errors.time]"
				/>
			</div>

			<label class="text-right" for="topic">Tema</label>

			<VInput
				id="topic"
				div-class="col-span-2"
				name="topic"
				v-model="addPersonForm.topic"
				v-model:errors="addPersonForm.errors.topic"
				:list="availableTopics"
				placeholder="Visitar para devolver la vista"
				required
			/>

			<div class="text-right">
				<label for="returnDate">Fecha</label>
				y
				<label for="returnTime">hora</label>
				de revisita
			</div>

			<div class="col-span-2">
				<div class="flex flex-wrap gap-2">
					<VInput
						id="returnDate"
						div-class="flex-1"
						type="date"
						v-model="addPersonForm.returnDate"
						v-model:errors="addPersonForm.errors.returnDate"
						:min="addPersonForm.date"
						hide-errors
						required
					/>

					<VInput
						id="returnTime"
						div-class="flex-1"
						type="time"
						v-model="addPersonForm.returnTime"
						v-model:errors="addPersonForm.errors.returnTime"
						hide-errors
						required
					/>
				</div>

				<VInputErrors
					:errors="[
						addPersonForm.errors.returnDate,
						addPersonForm.errors.returnTime,
					]"
				/>
			</div>

			<label class="text-right" for="notes">Notas</label>

			<VTextarea
				id="notes"
				div-class="col-span-2"
				class="resize-y min-h-16 max-h-72"
				v-model="addPersonForm.notes"
				v-model:errors="addPersonForm.errors.notes"
				:placeholder="
					[
						'Jesucristo me envió, no tengo muchas ganas de ir porque este hombre le ha hecho mucho daño a los santos en Jerusalén.\n',
						'Jesús dice que es un instrumento para llevar su nombre a las naciones.',
					].join('\n')
				"
			/>

			<VButton
				class="col-start-3"
				color="asparagus"
				type="submit"
				:disabled="addPersonMutation.isPending.value"
			>
				Guardar
			</VButton>
		</form>
	</main>
</template>
