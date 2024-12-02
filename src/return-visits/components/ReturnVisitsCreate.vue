<script setup lang="ts">
import { computed, ref } from "vue"
import { useAddReturnVisit } from "../queries/useAddReturnVisit"
import { router } from "../../router"
import { usePersonReturnVisits } from "../queries/usePersonReturnVisits"

const props = defineProps<{
	id: number
}>()

const id = computed(() => props.id)

const returnVisitsQuery = usePersonReturnVisits({ personId: id })
const addReturnVisitMutation = useAddReturnVisit({ personId: id })

const errors = ref<Record<string, string>>({})
const availableTopics = computed(
	() => new Set(returnVisitsQuery.data.value?.map(({ topic }) => topic))
)

const now = new Date()
const offset = now.getTimezoneOffset()
const date = ref(
	new Date(now.getTime() - offset * 60 * 1000).toISOString().split("T")[0]
)

const returnDate = ref(
	new Date(now.getTime() - offset * 60 * 1000 + 7 * 24 * 60 * 60 * 1000)
		.toISOString()
		.split("T")[0]
)

const defaultTime =
	now.getHours().toString().padStart(2, "0") +
	":" +
	now.getMinutes().toString().padStart(2, "0")

async function handleSubmit(event: Event) {
	const data = Object.fromEntries(new FormData(event.target as HTMLFormElement))

	if (!data.date) {
		errors.value = { ...errors.value, date: "Por favor selecciona una fecha" }
	}

	if (!data.time) {
		errors.value = { ...errors.value, time: "Por favor selecciona una hora" }
	}

	if (!data.topic) {
		errors.value = { ...errors.value, topic: "Por favor escribe un tema" }
	}

	if (!data.returnDate) {
		errors.value = {
			...errors.value,
			returnDate: "Por favor selecciona una fecha de revisita",
		}
	}

	if (!data.returnTime) {
		errors.value = {
			...errors.value,
			returnTime: "Por favor selecciona una fecha de revisita",
		}
	}

	const date = new Date(data.date + "T" + data.time)
	const returnDate = new Date(data.returnDate + "T" + data.returnTime)

	try {
		await addReturnVisitMutation.mutateAsync({
			date,
			topic: data.topic as string,
			returnDate,
			notes: data.notes as string,
		})
		router.replace({ name: "PeopleShow", params: { id: id.value } })
	} catch (error) {
		errors.value = {
			...errors.value,
			time: error instanceof Error ? error.message : "Error desconocido",
		}
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
					v-model="date"
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
					:value="defaultTime"
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
					v-model="returnDate"
					:min="date"
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
					:value="defaultTime"
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
			class="col-start-3 bg-asparagus-600 rounded px-2 py-1 text-lemon-50"
			type="submit"
			:disabled="addReturnVisitMutation.isPending.value"
		>
			Guardar
		</button>
	</form>
</template>
