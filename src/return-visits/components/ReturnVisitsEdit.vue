<script setup lang="ts">
import { computed, reactive, watch } from "vue"
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

type Errors<T> = Partial<Record<keyof T, string>>

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

const returnVisitForm = reactive({
	personId: returnVisit.value?.personId,
	topic: returnVisit.value?.topic,
	date: getDateForInput(returnVisit.value?.date),
	time: getTimeForInput(returnVisit.value?.date),
	returnDate: getDateForInput(returnVisit.value?.returnDate),
	returnTime: getTimeForInput(returnVisit.value?.returnDate),
	notes: returnVisit.value?.notes,
})
const errors = reactive<Errors<typeof returnVisitForm>>({})

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
	if (!returnVisitForm.personId) {
		errors.personId = "Elige a la persona"
	}

	if (!returnVisitForm.topic) {
		errors.topic = "Falta tema"
	}

	if (!returnVisitForm.date) {
		errors.date = "Falta fecha"
	}

	if (!returnVisitForm.time) {
		errors.time = "Falta hora"
	}

	if (!returnVisitForm.returnDate) {
		errors.returnDate = "Falta fecha de revisita"
	}

	if (!returnVisitForm.returnTime) {
		errors.returnTime = "Falta hora de revisita"
	}

	const date = new Date(returnVisitForm.date + "T" + returnVisitForm.time)
	const returnDate = new Date(
		returnVisitForm.returnDate + "T" + returnVisitForm.returnTime
	)

	if (date.getTime() > returnDate.getTime()) {
		errors.returnDate =
			"Fecha de revisita tiene que ser posterior a fecha de visita"
	}

	if (Object.values(errors).some(Boolean)) return

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
					div-class="col-span-2"
					id="personId"
					v-model="returnVisitForm.personId"
					:errors="errors.personId"
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
						v-model:errors="errors.date"
						hide-errors
						required
					/>

					<VInput
						id="time"
						div-class="flex-1"
						type="time"
						v-model="returnVisitForm.time"
						v-model:errors="errors.time"
						hide-errors
						required
					/>
				</div>

				<VInputErrors :errors="[errors.date, errors.time]" />
			</div>

			<label class="text-right" for="topic">Tema</label>

			<VInput
				id="topic"
				div-class="col-span-2"
				v-model="returnVisitForm.topic"
				v-model:errors="errors.topic"
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
						v-model:errors="errors.returnDate"
						:min="returnVisitForm.date"
						hide-errors
						required
					/>

					<VInput
						id="returnTime"
						div-class="flex-1"
						type="time"
						v-model="returnVisitForm.returnTime"
						v-model:errors="errors.returnTime"
						hide-errors
						required
					/>
				</div>

				<VInputErrors :errors="[errors.returnDate, errors.returnTime]" />
			</div>

			<label class="text-right" for="notes">Notas</label>

			<VTextarea
				div-class="col-span-2"
				id="notes"
				class="resize-y min-h-16 max-h-72"
				v-model="returnVisitForm.notes"
				v-model:errors="errors.notes"
			/>

			<RouterLink
				class="col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center"
				:to="{ name: 'PeopleShow', params: { id } }"
			>
				Cancelar
			</RouterLink>

			<button
				class="bg-asparagus-600 rounded px-2 py-1 text-lemon-50"
				type="submit"
			>
				Guardar
			</button>

			<button
				class="col-start-2 bg-fawn-600 rounded px-2 py-1 text-fawn-50 text-center"
				@click="handleDeleteReturnVisit"
				type="button"
			>
				Eliminar
			</button>
		</form>
	</div>
</template>
