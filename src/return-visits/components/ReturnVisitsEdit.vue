<script setup lang="ts">
import { computed, watch } from "vue"
import { useRouter } from "vue-router"
import { useReturnVisit } from "@/return-visits/queries/useReturnVisit"
import {
	getDateForInput,
	getTimeForInput,
} from "@/return-visits/composables/getDateTimeForInput"
import { useAvailableTopics } from "@/return-visits/composables/useAvailableTopics"
import { useUpdateReturnVisit } from "@/return-visits/queries/useUpdateReturnVisit"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { useDeleteReturnVisit } from "@/return-visits/queries/useDeleteReturnVisit"
import VInputErrors from "@/components/form/VInputErrors.vue"
import VInput from "@/components/form/VInput.vue"
import VTextarea from "@/components/form/VTextarea.vue"
import VSelect from "@/components/form/VSelect.vue"
import { useForm } from "@/components/form/useForm"
import VButton from "@/components/VButton.vue"

const router = useRouter()

const props = defineProps<{
	id: number
	date: Date
}>()

const personId = computed(() => props.id)
const date = computed(() => props.date)

const updateReturnVisit = useUpdateReturnVisit({ personId, date })
const deleteReturnVisit = useDeleteReturnVisit({ personId, date })

const returnVisitQuery = useReturnVisit({ personId, date })
const returnVisit = computed(() => returnVisitQuery.data.value)
const availableTopics = useAvailableTopics()
const peopleQuery = usePeopleQuery()
const availablePeople = computed(() => peopleQuery.data.value ?? [])

const returnVisitForm = useForm({
	personId: returnVisit.value?.personId,
	topic: returnVisit.value?.topic,
	date: getDateForInput(returnVisit.value?.date),
	time: getTimeForInput(returnVisit.value?.date),
	returnDate: getDateForInput(returnVisit.value?.returnDate),
	returnTime: getTimeForInput(returnVisit.value?.returnDate),
	notes: returnVisit.value?.notes,
})

watch(returnVisit, (returnVisit) => {
	returnVisitForm.personId = returnVisit?.personId
	returnVisitForm.topic = returnVisit?.topic
	returnVisitForm.date = getDateForInput(returnVisit?.date)
	returnVisitForm.time = getTimeForInput(returnVisit?.date)
	returnVisitForm.returnDate = getDateForInput(returnVisit?.returnDate)
	returnVisitForm.returnTime = getTimeForInput(returnVisit?.returnDate)
	returnVisitForm.notes = returnVisit?.notes
})

async function handleDeleteReturnVisit() {
	try {
		await deleteReturnVisit.mutateAsync()

		router.back()
	} catch (e) {
		console.info(e)
	}
}

async function handleSubmit() {
	if (updateReturnVisit.isPending.value) return

	if (!returnVisitForm.personId) {
		returnVisitForm.errors.personId = "Elige a la persona"
	}

	if (!returnVisitForm.topic) {
		returnVisitForm.errors.topic = "Falta tema"
	}

	if (!returnVisitForm.date) {
		returnVisitForm.errors.date = "Falta fecha"
	}

	if (!returnVisitForm.time) {
		returnVisitForm.errors.time = "Falta hora"
	}

	if (!returnVisitForm.returnDate) {
		returnVisitForm.errors.returnDate = "Falta fecha de revisita"
	}

	if (!returnVisitForm.returnTime) {
		returnVisitForm.errors.returnTime = "Falta hora de revisita"
	}

	const date = new Date(returnVisitForm.date + "T" + returnVisitForm.time)
	const returnDate = new Date(
		returnVisitForm.returnDate + "T" + returnVisitForm.returnTime
	)

	if (date.getTime() > returnDate.getTime()) {
		returnVisitForm.errors.returnDate =
			"Fecha de revisita tiene que ser posterior a fecha de visita"
	}

	if (Object.values(returnVisitForm.errors).some(Boolean)) return

	try {
		await updateReturnVisit.mutateAsync({
			personId: returnVisitForm.personId,
			date,
			topic: returnVisitForm.topic,
			returnDate,
			notes: returnVisitForm.notes,
		})

		router.back()
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
	}
}
</script>

<template>
	<div>
		<template v-if="returnVisitQuery.isLoading.value">Cargando...</template>
		<template v-else-if="returnVisitQuery.error.value || !returnVisit">
			{{ returnVisitQuery.error.value || "Error" }}
		</template>
		<form
			v-else
			class="grid grid-cols-3 gap-2 gap-y-3"
			@submit.prevent="handleSubmit"
		>
			<template v-if="availablePeople.length > 1">
				<label class="text-right" for="personId">Persona</label>

				<VSelect
					id="personId"
					div-class="col-span-2"
					v-model="returnVisitForm.personId"
					v-model:errors="returnVisitForm.errors.personId"
				>
					<option
						v-for="person in availablePeople"
						:key="person.id"
						:value="person.id"
					>
						{{ person.name }}
					</option>
				</VSelect>
			</template>

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
						v-model="returnVisitForm.date"
						v-model:errors="returnVisitForm.errors.date"
						hide-errors
						required
					/>

					<VInput
						id="time"
						div-class="flex-1"
						type="time"
						v-model="returnVisitForm.time"
						v-model:errors="returnVisitForm.errors.time"
						hide-errors
						required
					/>
				</div>

				<VInputErrors
					:errors="[returnVisitForm.errors.date, returnVisitForm.errors.time]"
				/>
			</div>

			<label class="text-right" for="topic">Tema</label>

			<VInput
				id="topic"
				div-class="col-span-2"
				v-model="returnVisitForm.topic"
				v-model:errors="returnVisitForm.errors.topic"
				:list="availableTopics"
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
						v-model="returnVisitForm.returnDate"
						v-model:errors="returnVisitForm.errors.returnDate"
						:min="returnVisitForm.date"
						hide-errors
						required
					/>

					<VInput
						id="returnTime"
						div-class="flex-1"
						type="time"
						v-model="returnVisitForm.returnTime"
						v-model:errors="returnVisitForm.errors.returnTime"
						hide-errors
						required
					/>
				</div>

				<VInputErrors
					:errors="[
						returnVisitForm.errors.returnDate,
						returnVisitForm.errors.returnTime,
					]"
				/>
			</div>

			<label class="text-right" for="notes">Notas</label>

			<VTextarea
				div-class="col-span-2"
				id="notes"
				class="resize-y min-h-16 max-h-72"
				v-model="returnVisitForm.notes"
				v-model:errors="returnVisitForm.errors.notes"
			/>

			<RouterLink
				class="col-start-2 border underline border-asparagus-600 rounded-sm px-2 py-1 text-asparagus-600 text-center"
				:to="{ name: 'PeopleShow', params: { id } }"
			>
				Cancelar
			</RouterLink>

			<VButton color="asparagus" type="submit">Guardar</VButton>

			<VButton
				class="col-start-2"
				color="fawn"
				@click="handleDeleteReturnVisit"
				type="button"
			>
				Eliminar
			</VButton>
		</form>
	</div>
</template>
