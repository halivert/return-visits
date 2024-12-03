<script setup lang="ts">
import { computed, watch } from "vue"
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
import { useForm } from "@/components/form/useForm"
import { usePersonReturnVisits } from "@/return-visits/queries/usePersonReturnVisits"
import { WEEK_IN_MILIS } from "@/constants"

const router = useRouter()

const props = defineProps<{
	id: number
}>()

const personId = computed(() => props.id)

const lastReturnVisitQuery = usePersonReturnVisits({ personId })
const addReturnVisitMutation = useAddReturnVisit({ personId })
const availableTopics = useAvailableTopics()

const lastReturnVisit = computed(() => lastReturnVisitQuery.data.value?.at(0))

const now = new Date()
const sevenDaysAfter = new Date(now.getTime() + WEEK_IN_MILIS)

const returnVisitForm = useForm({
	date: getDateForInput(now),
	time: getTimeForInput(now),
	topic: "",
	returnDate: getDateForInput(sevenDaysAfter),
	returnTime: getTimeForInput(sevenDaysAfter),
	notes: "",
})

watch(lastReturnVisit, (returnVisit) => {
	if (!returnVisit) return

	const returnDate = returnVisit.returnDate
	returnVisitForm.date = getDateForInput(returnDate)
	returnVisitForm.time = getTimeForInput(returnDate)

	const sevenDaysAfter = new Date(returnDate.getTime() + WEEK_IN_MILIS)

	returnVisitForm.returnDate = getDateForInput(sevenDaysAfter)
	returnVisitForm.returnTime = getTimeForInput(sevenDaysAfter)
})

async function handleSubmit() {
	if (addReturnVisitMutation.isPending.value) return

	if (!returnVisitForm.date) {
		returnVisitForm.errors.date = "Falta fecha"
	}

	if (!returnVisitForm.time) {
		returnVisitForm.errors.time = "Falta hora"
	}

	if (!returnVisitForm.topic) {
		returnVisitForm.errors.topic = "Falta tema"
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

	if (Object.values(returnVisitForm.errors).some(Boolean)) {
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
	} catch (e) {
		console.info(e)
		alert("Error guardando los datos\nPor favor intenta de nuevo")
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
			placeholder="En esta visita hablamos de..."
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
			id="notes"
			div-class="col-span-2"
			class="resize-y min-h-16 max-h-72"
			placeholder="Quedé en volver para platicar sobre..."
			v-model="returnVisitForm.notes"
			v-model:errors="returnVisitForm.errors.notes"
		></VTextarea>

		<RouterLink
			class="col-start-2 border underline border-asparagus-600 rounded px-2 py-1 text-asparagus-600 text-center"
			:to="{ name: 'PeopleShow', params: { personId } }"
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
