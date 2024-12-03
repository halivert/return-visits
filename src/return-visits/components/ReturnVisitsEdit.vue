<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useReturnVisit } from "@/return-visits/queries/useReturnVisit"
import {
	getDateForInput,
	getTimeForInput,
} from "@/return-visits/composables/getDateTimeForInput"
import { useAvailableTopics } from "@/return-visits/composables/useAvailableTopics"
import { useUpdateReturnVisit } from "@/return-visits/queries/useUpdateReturnVisit"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { useDeleteReturnVisit } from "../queries/useDeleteReturnVisit"

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

const errors = ref<Record<string, string>>({})
const returnVisitForm = reactive({
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
	if (!returnVisitForm.personId) {
		errors.value = { ...errors.value, personId: "Elige a la persona" }
	}

	if (!returnVisitForm.topic) {
		errors.value = { ...errors.value, topic: "Falta tema" }
	}

	if (!returnVisitForm.date) {
		errors.value = { ...errors.value, date: "Falta fecha" }
	}

	if (!returnVisitForm.time) {
		errors.value = { ...errors.value, time: "Falta hora" }
	}

	if (!returnVisitForm.returnDate) {
		errors.value = { ...errors.value, returnDate: "Falta fecha de revisita" }
	}

	if (!returnVisitForm.returnTime) {
		errors.value = { ...errors.value, returnTime: "Falta hora de revisita" }
	}

	if (Object.values(errors.value).some(Boolean)) return

	try {
		await updateReturnVisit.mutateAsync({
			personId: returnVisitForm.personId,
			date: new Date(returnVisitForm.date + "T" + returnVisitForm.time),
			topic: returnVisitForm.topic,
			returnDate: new Date(
				returnVisitForm.returnDate + "T" + returnVisitForm.returnTime
			),
			notes: returnVisitForm.notes,
		})

		router.replace({ name: "PeopleShow", params: { id: personId.value } })
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

				<div class="col-span-2">
					<select
						id="personId"
						:class="[
							'w-full h-8 px-2 py-1 border dark:text-lemon-50',
							errors['personId']
								? 'border-chili-400 accent-chili-600'
								: 'border-asparagus-100 accent-asparagus-600',
						]"
						v-model="returnVisitForm.personId"
					>
						<option
							v-for="person in availablePeople"
							:key="person.id"
							:value="person.id"
						>
							{{ person.name }}
						</option>
					</select>

					<small class="text-chili-600" v-if="errors['personId']">
						{{ errors["personId"] }}
					</small>
				</div>
			</template>

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
						v-model="returnVisitForm.date"
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
						v-model="returnVisitForm.time"
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
					v-model="returnVisitForm.topic"
					@input="errors['topic'] = ''"
					list="topicDataList"
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
						v-model="returnVisitForm.returnDate"
						:min="returnVisitForm.date"
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
						v-model="returnVisitForm.returnTime"
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
					rows="8"
					v-model="returnVisitForm.notes"
					name="notes"
					maxlength="250"
				></textarea>

				<small class="text-chili-600" v-if="errors['notes']">
					{{ errors["notes"] }}
				</small>
			</div>

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
