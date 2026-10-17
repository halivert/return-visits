<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import QrScanner from "qr-scanner"
import VButton from "@/components/VButton.vue"
import { useRestoreBackup } from "@/backups/backupData"
import {
	downloadTransfer,
	parseTransferCode,
	TransferCode,
} from "@/backups/transfer"

type Status = "scanning" | "confirm" | "receiving" | "done"

const route = useRoute()
const router = useRouter()
const { restore } = useRestoreBackup()

const video = ref<HTMLVideoElement>()
const status = ref<Status>("scanning")
const code = ref<TransferCode | null>(parseTransferCode(route.hash))
const error = ref("")

/**
 * On iPhone, links open in Safari, whose data is separate from the installed
 * app
 */
const isStandalone =
	matchMedia("(display-mode: standalone)").matches ||
	("standalone" in navigator && navigator.standalone === true)

let scanner: QrScanner | undefined

async function startScanner() {
	if (!video.value) return
	error.value = ""

	scanner = new QrScanner(
		video.value,
		({ data }) => {
			const scanned = parseTransferCode(data)
			if (!scanned) return

			code.value = scanned
			status.value = "confirm"
			scanner?.stop()
		},
		{ preferredCamera: "environment", returnDetailedScanResult: true }
	)

	try {
		await scanner.start()
	} catch {
		error.value =
			"No se pudo abrir la cámara, revisa los permisos del navegador"
	}
}

async function receive() {
	if (!code.value) return
	error.value = ""
	status.value = "receiving"

	try {
		await restore(await downloadTransfer(code.value))
		status.value = "done"
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Error al recibir los datos"
		status.value = "confirm"
	} finally {
		// The key shouldn't stay in the history
		router.replace({ hash: "" })
	}
}

onMounted(() => {
	if (code.value) {
		status.value = "confirm"
	} else {
		startScanner()
	}
})

onUnmounted(() => scanner?.destroy())
</script>

<template>
	<main class="max-w-prose mx-auto py-2 px-3 space-y-3">
		<h1 class="text-xl font-semibold">Recibir de otro teléfono</h1>

		<template v-if="status === 'scanning'">
			<p class="text-sm">
				En el otro teléfono ve a Configuración, toca
				<strong>Enviar a otro teléfono</strong> y escanea el código aquí.
			</p>

			<video ref="video" class="w-full max-w-sm mx-auto rounded-sm bg-black" />
		</template>

		<template v-else-if="status === 'confirm' || status === 'receiving'">
			<p v-if="!isStandalone" class="text-sm bg-lemon-100 dark:bg-lemon-950 p-2">
				Estás en el navegador, no en la aplicación instalada. Si ya la tienes
				instalada, ábrela y escanea el código desde ahí, porque en iPhone sus
				datos están separados.
			</p>

			<p>
				Los datos del otro teléfono <strong>reemplazarán</strong> los datos
				actuales de este teléfono.
			</p>

			<div class="flex gap-3">
				<VButton
					color="asparagus"
					:loading="status === 'receiving'"
					@click="receive"
				>
					Recibir datos
				</VButton>
				<VButton :href="{ name: 'Config' }">Cancelar</VButton>
			</div>
		</template>

		<template v-else>
			<p>¡Listo! Tus datos ya están en este teléfono.</p>
			<p class="text-sm">
				Las notificaciones se configuran en cada teléfono, actívalas en
				Configuración si las quieres aquí.
			</p>

			<VButton color="asparagus" :href="{ name: 'Home' }">Ver personas</VButton>
		</template>

		<p v-if="error" class="text-sm text-chili-600">{{ error }}</p>
	</main>
</template>
