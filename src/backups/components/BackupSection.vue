<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import VButton from "@/components/VButton.vue"
import VInput from "@/components/form/VInput.vue"
import { useRestoreBackup } from "@/backups/backupData"
import {
	createBackupFile,
	MIN_PASSWORD_LENGTH,
	readBackupFile,
} from "@/backups/backupFile"
import {
	backupStatus,
	markBackedUp,
	requestPersistentStorage,
} from "@/backups/backupStatus"

const router = useRouter()
const { restore, isPending: isRestoring } = useRestoreBackup()

const password = ref("")
const showPassword = ref(false)
const error = ref("")
const exporting = ref(false)
const fileInput = ref<HTMLInputElement>()
const persisted = ref<boolean>()
/** Encrypted file waiting for a second tap, when the browser blocked sharing */
const readyFile = ref<File>()

const canShareFiles =
	"canShare" in navigator &&
	navigator.canShare({
		files: [new File([""], "test.txt", { type: "text/plain" })],
	})

const lastBackup = computed(() => {
	const { lastBackupAt } = backupStatus.value
	if (!lastBackupAt) return "Nunca"

	return new Date(lastBackupAt).toLocaleString("es-MX", {
		dateStyle: "long",
		timeStyle: "short",
	})
})

watch(password, () => (readyFile.value = undefined))

onMounted(async () => {
	persisted.value = await requestPersistentStorage().catch(() => false)
})

function download(file: File) {
	const url = URL.createObjectURL(file)
	const link = document.createElement("a")
	link.href = url
	link.download = file.name
	link.click()
	setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function share(file: File) {
	try {
		await navigator.share({ files: [file], title: "Respaldo Revisitas" })
		readyFile.value = undefined
		markBackedUp()
	} catch (e) {
		if (!(e instanceof DOMException)) throw e

		// The user closed the share sheet
		if (e.name === "AbortError") return

		// Encrypting took too long after the tap, ask for another one
		if (e.name === "NotAllowedError") {
			readyFile.value = file
			return
		}

		throw e
	}
}

async function exportBackup() {
	error.value = ""
	exporting.value = true

	try {
		const file = await createBackupFile(password.value)

		if (canShareFiles) {
			await share(file)
		} else {
			download(file)
			markBackedUp()
		}
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Error al crear respaldo"
	} finally {
		exporting.value = false
	}
}

async function importBackup(event: Event) {
	error.value = ""
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	input.value = ""

	if (!file) return

	const sure = confirm(
		"¿Segura que deseas importar estos datos?\nEsto sobreescribirá los datos actuales."
	)

	if (!sure) return

	try {
		await restore(await readBackupFile(file, password.value))
		markBackedUp()
		router.push({ name: "Home" })
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Error en la importación"
	}
}
</script>

<template>
	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Respaldos</h2>

		<p class="text-sm">
			El respaldo se cifra con tu contraseña. Guárdalo donde quieras (WhatsApp,
			Drive, correo); sin la contraseña nadie puede leerlo.
			<strong>Si olvidas la contraseña no podrás recuperarlo.</strong>
		</p>

		<div>
			<label for="backup-password">Contraseña del respaldo</label>
			<VInput
				id="backup-password"
				:type="showPassword ? 'text' : 'password'"
				v-model="password"
				autocomplete="new-password"
				:minlength="MIN_PASSWORD_LENGTH"
				hide-errors
			/>
			<label class="text-sm inline-flex gap-1 items-center mt-1">
				<input type="checkbox" v-model="showPassword" />
				Mostrar contraseña
			</label>
		</div>

		<div class="flex flex-wrap gap-3">
			<VButton
				v-if="readyFile"
				color="asparagus"
				@click="share(readyFile).catch((e) => (error = e.message))"
			>
				Compartir ahora
			</VButton>
			<VButton
				v-else
				color="asparagus"
				:loading="exporting"
				@click="exportBackup"
			>
				{{ canShareFiles ? "Compartir respaldo" : "Descargar respaldo" }}
			</VButton>

			<input
				ref="fileInput"
				class="hidden"
				@change="importBackup"
				type="file"
				accept=".txt,.return-visits,text/plain,application/json"
			/>
			<VButton
				color="lemon"
				:loading="isRestoring"
				@click="fileInput?.click()"
			>
				Importar respaldo
			</VButton>
		</div>

		<p v-if="error" class="text-sm text-chili-600">{{ error }}</p>

		<p class="text-sm">Último respaldo: {{ lastBackup }}</p>

		<p v-if="persisted === false" class="text-sm">
			El navegador podría borrar los datos si falta espacio. Instala la
			aplicación en la pantalla de inicio para protegerlos.
		</p>
	</section>
</template>
