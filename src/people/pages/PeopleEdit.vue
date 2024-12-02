<script lang="ts">
export default {
	async beforeRouteEnter(to, _from, next) {
		try {
			await useAsyncPerson({ id: parseInt(to.params.id as string, 10) })

			next()
		} catch (e) {
			next({ name: "NotFound" })
		}
	},
}
</script>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { onBeforeRouteUpdate, useRouter } from "vue-router"
import { useGeolocation } from "@vueuse/core"
import { usePerson } from "@people/queries/usePerson"
import { useColonies } from "@people/composables/useColonies"
import { Person } from "@/db/models/Person"
import { useAsyncPerson } from "@people/queries/useAsyncPerson"
import { useUpdatePerson } from "../queries/useUpdatePerson"

const router = useRouter()
const colonies = useColonies()
const geolocation = useGeolocation({ immediate: false })

onBeforeRouteUpdate((to) => {
	useAsyncPerson({ id: parseInt(to.params.id as string, 10) }).catch(() => {
		router.replace({ name: "NotFound" })
	})
})

const props = defineProps<{
	id: number
}>()

const id = computed(() => props.id)

const personQuery = usePerson({ id })
const person = computed(() => personQuery.data.value)

watch(person, (person) => {
	if (!person) return

	personForm.name = person.name
	personForm.colony = person.colony
	personForm.description = person.description
})

const personForm = reactive<Omit<Person, "id" | "location">>({
	name: person.value?.name ?? "",
	colony: person.value?.colony ?? "",
	description: person.value?.description ?? "",
})
const errors = ref<Record<string, string>>({})
const locationRecentlyUpdated = ref(false)

const updatePersonMutation = useUpdatePerson({ id })

async function updatePerson(person: Partial<Omit<Person, "id">>) {
	if (updatePersonMutation.isPending.value) return
	if (Object.values(errors.value).some((error) => error)) return

	try {
		await updatePersonMutation.mutateAsync(
			"location" in person
				? { location: person.location }
				: {
						name: person.name,
						colony: person.colony,
						description: person.description,
				  }
		)

		if (!("location" in person)) {
			return router.push({
				name: "PeopleShow",
				params: { id: id.value },
			})
		}

		locationRecentlyUpdated.value = true
		setTimeout(() => {
			locationRecentlyUpdated.value = false
		}, 2000)
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
	}
}

function handleSubmit() {
	if (!personForm.name) {
		errors.value = { ...errors.value, name: "Falta nombre" }
	}

	if (!personForm.colony) {
		errors.value = { ...errors.value, colony: "Falta colonia" }
	}

	updatePerson(personForm)
}

function updatePersonLocation() {
	geolocation.resume()

	watch(
		[geolocation.coords, geolocation.error],
		async ([coords, error]) => {
			if (error) {
				errors.value = {
					...errors.value,
					location:
						"Error actualizando la ubicación.\nRevisa que la aplicación tenga los permisos necesarios.",
				}
				return
			}

			errors.value = {
				...errors.value,
				location: "",
			}

			updatePerson({
				location: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					altitude: coords.altitude,
				},
			})
		},
		{ once: true }
	)
}

function removePersonLocation() {
	updatePerson({ location: undefined })
}
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<template v-if="!person">
			<h1 class="text-3xl font-bold text-center">Error</h1>
		</template>

		<template v-else>
			<h1 class="text-3xl font-bold mb-4">Editar persona: {{ person.name }}</h1>

			<form
				class="grid grid-cols-3 gap-2 gap-y-3"
				@submit.prevent="handleSubmit"
			>
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
						v-model="personForm.name"
						@input="errors['name'] = ''"
						:placeholder="person.name"
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
						v-model="personForm.colony"
						@input="errors['colony'] = ''"
						:placeholder="person.colony"
						required
					/>

					<small class="text-chili-600" v-if="errors['colony']">
						{{ errors["colony"] }}
					</small>

					<datalist id="colonyList">
						<option v-for="colony in colonies" :key="colony">
							{{ colony }}
						</option>
					</datalist>
				</div>

				<div class="col-start-2 col-span-2">
					<div class="flex gap-2">
						<button
							:class="[
								'flex-1 px-2 py-1 rounded',
								'disabled:cursor-not-allowed disabled:grayscale',
								errors['location']
									? 'bg-chili-600 text-chili-50'
									: 'bg-lemon-500',
							]"
							type="button"
							@click="updatePersonLocation"
							:disabled="
								updatePersonMutation.isPending.value || locationRecentlyUpdated
							"
						>
							<template v-if="locationRecentlyUpdated">
								Ubicación actualizada
							</template>
							<template v-else>Actualizar ubicación</template>
						</button>

						<button
							v-if="person.location && !locationRecentlyUpdated"
							:class="[
								'flex-1 px-2 py-1 rounded text-fawn-50',
								'bg-fawn-600 disabled:cursor-not-allowed disabled:grayscale',
							]"
							type="button"
							@click="removePersonLocation"
							:disabled="
								updatePersonMutation.isPending.value || locationRecentlyUpdated
							"
						>
							Eliminar ubicación
						</button>
					</div>

					<small
						class="text-chili-600 whitespace-pre"
						v-if="errors['location']"
					>
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
						]"
						rows="8"
						name="description"
						v-model="personForm.description"
						:placeholder="person.description"
						maxlength="250"
					></textarea>
				</div>

				<RouterLink
					class="col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center"
					:to="{ name: 'PeopleShow', params: { id } }"
				>
					Cancelar
				</RouterLink>

				<button
					class="col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50 disabled:cursor-not-allowed disabled:grayscale"
					type="submit"
					:disabled="updatePersonMutation.isPending.value"
				>
					Guardar
				</button>
			</form>
		</template>
	</main>
</template>
