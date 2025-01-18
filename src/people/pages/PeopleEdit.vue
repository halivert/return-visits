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
import { computed, ref, watch } from "vue"
import { onBeforeRouteUpdate, useRouter } from "vue-router"
import { useGeolocation } from "@vueuse/core"
import { usePerson } from "@/people/queries/usePerson"
import { useColonies } from "@/people/composables/useColonies"
import { Person } from "@/db/models/Person"
import { useAsyncPerson } from "@/people/queries/useAsyncPerson"
import { useUpdatePerson } from "@/people/queries/useUpdatePerson"
import { useDeletePerson } from "@/people/queries/useDeletePerson"
import { useForm } from "@/components/form/useForm"
import VInput from "@/components/form/VInput.vue"
import VInputErrors from "@/components/form/VInputErrors.vue"
import VTextarea from "@/components/form/VTextarea.vue"
import VButton from "@/components/VButton.vue"

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
const locationLoading = ref(false)
const person = computed(() => personQuery.data.value)
const updatePersonMutation = useUpdatePerson({ id })
const deletePerson = useDeletePerson({ id })

const personForm = useForm({
	name: person.value?.name,
	colony: person.value?.colony,
	description: person.value?.description,
	location: person.value?.location,
})

watch(person, (person) => {
	personForm.name = person?.name
	personForm.colony = person?.colony
	personForm.description = person?.description
})

const locationRecentlyUpdated = ref(false)

async function handleSubmit() {
	if (updatePersonMutation.isPending.value) return

	if (!personForm.name) {
		personForm.errors.name = "Falta nombre"
	}

	if (!personForm.colony) {
		personForm.errors.colony = "Falta colonia"
	}

	if (Object.values(personForm.errors).some(Boolean)) return

	try {
		await updatePersonMutation.mutateAsync(personForm)

		return router.back()
	} catch (e) {
		console.info(e)
	}
}

async function updateLocation(coords?: Person["location"]) {
	try {
		personForm.location = coords

		await updatePersonMutation.mutateAsync(personForm)

		locationRecentlyUpdated.value = true
		setTimeout(() => {
			locationRecentlyUpdated.value = false
		}, 2000)
	} catch (e) {
		personForm.errors.location = e instanceof Error ? e.message : `${e}`
	}
}

function updatePersonLocation() {
	personForm.errors.location = ""
	locationLoading.value = true
	geolocation.resume()

	watch(
		[geolocation.coords, geolocation.error],
		([coords, error]) => {
			locationLoading.value = false
			if (error) {
				personForm.errors.location =
					"Error actualizando la ubicación.\nRevisa que la aplicación tenga los permisos necesarios."

				return
			}

			updateLocation(coords)
		},
		{ once: true },
	)
}

function removePersonLocation() {
	updateLocation(undefined)
}

async function handleDeletePerson() {
	const answer = confirm("¿Segura que deseas eliminar a esta persona?")

	if (!answer) return

	try {
		await deletePerson.mutateAsync()

		router.go(-2)
	} catch (e) {
		console.info(e)
	}
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

				<VInput
					id="name"
					div-class="col-span-2"
					v-model="personForm.name"
					v-model:errors="personForm.errors.name"
					:placeholder="person.name"
					required
				/>

				<label class="text-right" for="colony">Colonia</label>

				<VInput
					id="colony"
					div-class="col-span-2"
					:list="colonies"
					v-model="personForm.colony"
					v-model:errors="personForm.errors.colony"
					:placeholder="person.colony"
					required
				/>

				<div class="col-start-2 col-span-2">
					<div class="flex gap-2">
						<VButton
							:class="[
								'flex-1',
								personForm.errors.location
									? 'bg-chili-600 text-chili-50 dark:bg-chili-700'
									: 'bg-lemon-500 dark:bg-lemon-600',
							]"
							type="button"
							@click="updatePersonLocation"
							:loading="
								locationLoading ||
								updatePersonMutation.isPending.value ||
								locationRecentlyUpdated
							"
						>
							<template v-if="locationRecentlyUpdated">
								Ubicación actualizada
							</template>
							<template v-else>Actualizar ubicación</template>
						</VButton>

						<VButton
							v-if="person.location && !locationRecentlyUpdated"
							color="fawn"
							class="flex-1"
							type="button"
							@click="removePersonLocation"
							:disabled="
								locationLoading ||
								updatePersonMutation.isPending.value ||
								locationRecentlyUpdated
							"
						>
							Eliminar ubicación
						</VButton>
					</div>

					<VInputErrors :errors="personForm.errors.location" />
				</div>

				<label class="text-right" for="description">
					Dirección y descripción
				</label>

				<VTextarea
					id="description"
					div-class="col-span-2"
					class="resize-y min-h-16 max-h-72"
					rows="8"
					v-model="personForm.description"
					v-model:errors="personForm.errors.description"
					:placeholder="person.description"
					maxlength="250"
				/>

				<RouterLink
					class="col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center"
					:to="{ name: 'PeopleShow', params: { id } }"
				>
					Cancelar
				</RouterLink>

				<VButton
					class="col-start-3"
					color="asparagus"
					type="submit"
					:disabled="updatePersonMutation.isPending.value"
				>
					Guardar
				</VButton>

				<VButton
					class="col-start-2"
					color="fawn"
					@click="handleDeletePerson"
					type="button"
				>
					Eliminar
				</VButton>
			</form>
		</template>
	</main>
</template>
