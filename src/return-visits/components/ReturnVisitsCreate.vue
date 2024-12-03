<script setup lang="ts">
import { computed, reactive } from "vue"
import { useRouter } from "vue-router"
import { useAddReturnVisit } from "@/return-visits/queries/useAddReturnVisit"
import {
	getDateForInput,
	getTimeForInput,
} from "@/return-visits/composables/getDateTimeForInput"
import VInput from "@/components/form/VInput.vue"
import VTextarea from "@/components/form/VTextarea.vue"
import { useAvailableTopics } from "@/return-visits/composables/useAvailableTopics"
import VInputErrors from "@/components/form/VInputErrors.vue"

type Errors<T> = Partial<Record<keyof T, string>>

const router = useRouter()

const props = defineProps<{
	id: number
}>()

const id = computed(() => props.id)

const addReturnVisitMutation = useAddReturnVisit({ personId: id })
const availableTopics = useAvailableTopics()

const now = new Date()
const sevenDaysAfter = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const returnVisitForm = reactive({
	date: getDateForInput(now),
	time: getTimeForInput(now),
	topic: "",
	returnDate: getDateForInput(sevenDaysAfter),
	returnTime: getTimeForInput(sevenDaysAfter),
	notes: "",
})

const errors = reactive<Errors<typeof returnVisitForm>>({})

async function handleSubmit() {
	if (!returnVisitForm.date) {
		errors.date = "Falta fecha"
	}

	if (!returnVisitForm.time) {
		errors.time = "Falta hora"
	}

	if (!returnVisitForm.topic) {
		errors.topic = "Falta tema"
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

	if (Object.values(errors).some(Boolean)) {
		return
	}

	try {
		await addReturnVisitMutation.mutateAsync({
			date,
			topic: returnVisitForm.topic as string,
			returnDate,
			notes: returnVisitForm.notes as string,
		})

		router.back()
	} catch (error) {
		errors.time = error instanceof Error ? error.message : "Error desconocido"
	}
}
</script>

<template>
	<form class="grid grid-cols-3 gap-2 gap-y-3" @submit.prevent="handleSubmit">
		<div class="text-right">
			<label for="date">Fecha</label>
			y
			<label for="time">hora</label>
		</div>

		<div class="col-span-2">
			<div class="flex flex-wrap gap-2">
				<VInput
					div-class="flex-1"
					id="date"
					type="date"
					v-model="returnVisitForm.date"
					v-model:errors="errors.date"
					hide-errors
					required
				/>

				<VInput
					div-class="flex-1"
					id="time"
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
			div-class="col-span-2"
			id="topic"
			v-model="returnVisitForm.topic"
			v-model:errors="errors.topic"
			placeholder="En esta visita hablamos de..."
			list="topicDataList"
			required
		/>

		<datalist id="topicDataList">
			<option v-for="topic in availableTopics" :key="topic">
				{{ topic }}
			</option>
		</datalist>

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
					:min="returnVisitForm.date"
					v-model:errors="errors.returnDate"
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
			placeholder="Quedé en volver para platicar sobre..."
			v-model="returnVisitForm.notes"
			v-model:errors="errors.notes"
		></VTextarea>

		<RouterLink
			class="col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center"
			:to="{ name: 'PeopleShow', params: { id } }"
		>
			Cancelar
		</RouterLink>

		<button
			class="col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50"
			type="submit"
			:disabled="addReturnVisitMutation.isPending.value"
		>
			Guardar
		</button>
	</form>
</template>
