<script setup lang="ts">
import { computed } from "vue"
import { useImportPeople } from "@/people/queries/useImportPeople"
import { usePeopleQuery } from "@/people/queries/usePeople"
import { useImportReturnVisits } from "@/return-visits/queries/useImportReturnVisits"
import { useReturnVisits } from "@/return-visits/queries/useReturnVisits"
import { ReturnVisit } from "@/return-visits/models/ReturnVisit"
import { Person } from "@/db/models/Person"
import { useRouter } from "vue-router"

interface Data {
	people: Person[]
	returnVisits: ReturnVisit[]
}

const peopleQuery = usePeopleQuery()
const returnVisitsQuery = useReturnVisits()
const router = useRouter()

const importPeople = useImportPeople()
const importReturnVisits = useImportReturnVisits()

const url = computed(() => {
	if (peopleQuery.isLoading.value || returnVisitsQuery.isLoading.value) {
		return undefined
	}

	const data: Data = {
		people: peopleQuery.data.value ?? [],
		returnVisits: returnVisitsQuery.data.value ?? [],
	}

	const blob = new Blob([JSON.stringify(data)], { type: "application/json" })

	return URL.createObjectURL(blob)
})

const fileName = computed(() => {
	return new Date().toISOString() + ".return-visits"
})

async function importData(event: Event) {
	const sure = confirm(
		"¿Segura que deseas importar estos datos?\nEsto sobreescribirá los datos actuales."
	)

	if (!sure) return

	const files = (event.target as HTMLInputElement).files
	if (!files?.[0]) {
		alert("Error en importación de datos")
		return
	}

	try {
		const file = files[0]
		const data: Data = JSON.parse(await file.text())

		await importPeople.mutateAsync(data.people)
		await importReturnVisits.mutateAsync(data.returnVisits)

		router.back()
	} catch (e) {
		alert("Error en la importación")
	}
}
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3">
		<div class="flex gap-3 justify-center">
			<a
				:href="url"
				:download="fileName"
				class="bg-asparagus-600 rounded px-2 py-1 text-asparagus-50"
			>
				Exportar datos
			</a>

			<input
				id="fileInput"
				class="hidden"
				@change="importData"
				type="file"
				accept=".return-visits,application/json"
			/>

			<label
				v-if="
					!importReturnVisits.isPending.value && !importPeople.isPending.value
				"
				class="bg-lemon-600 rounded px-2 py-1 text-lemon-50 cursor-pointer"
				for="fileInput"
			>
				Importar datos
			</label>
		</div>
	</main>
</template>
