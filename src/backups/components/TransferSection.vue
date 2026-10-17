<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue"
import { useIntervalFn, useNow } from "@vueuse/core"
import { renderSVG } from "uqr"
import VButton from "@/components/VButton.vue"
import {
	cancelTransfer,
	createTransfer,
	isTransferPending,
	isTransferSupported,
	Transfer,
} from "@/backups/transfer"

type Status = "idle" | "waiting" | "received" | "expired"

const supported = isTransferSupported()
const transfer = ref<Transfer>()
const status = ref<Status>("idle")
const loading = ref(false)
const error = ref("")
const copied = ref(false)
const now = useNow({ interval: 1000 })

const qr = computed(() =>
	transfer.value ? renderSVG(transfer.value.url, { ecc: "M" }) : ""
)

const remaining = computed(() => {
	if (!transfer.value) return ""

	const seconds = Math.max(
		0,
		Math.round((transfer.value.expiresAt - now.value.getTime()) / 1000)
	)

	return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
})

const polling = useIntervalFn(
	async () => {
		if (!transfer.value) return

		if (Date.now() > transfer.value.expiresAt) {
			status.value = "expired"
			polling.pause()
			return
		}

		if (!(await isTransferPending(transfer.value.id).catch(() => true))) {
			status.value = "received"
			polling.pause()
		}
	},
	3000,
	{ immediate: false }
)

async function start() {
	error.value = ""
	loading.value = true

	try {
		transfer.value = await createTransfer()
		status.value = "waiting"
		polling.resume()
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Error desconocido"
	} finally {
		loading.value = false
	}
}

async function stop() {
	polling.pause()

	if (transfer.value && status.value === "waiting") {
		await cancelTransfer(transfer.value.id).catch(console.error)
	}

	transfer.value = undefined
	status.value = "idle"
}

async function copyLink() {
	if (!transfer.value) return

	await navigator.clipboard.writeText(transfer.value.url)
	copied.value = true
	setTimeout(() => (copied.value = false), 2000)
}

onUnmounted(stop)
</script>

<template>
	<section v-if="supported" class="space-y-2">
		<h2 class="text-lg font-semibold">Cambiar de teléfono</h2>

		<p class="text-sm">
			Pasa todos tus datos a otro teléfono escaneando un código. Los datos viajan
			cifrados, el servidor no puede leerlos y los borra al descargarlos o a
			los 10 minutos.
		</p>

		<div v-if="status === 'idle'" class="flex flex-wrap gap-3">
			<VButton color="asparagus" :loading="loading" @click="start">
				Enviar a otro teléfono
			</VButton>

			<VButton color="lemon" :href="{ name: 'Transfer' }">
				Recibir de otro teléfono
			</VButton>
		</div>

		<div v-else-if="status === 'waiting'" class="space-y-2">
			<p class="text-sm">
				En el otro teléfono abre Revisitas, ve a Configuración y toca
				<strong>Recibir de otro teléfono</strong>. Luego escanea este código.
			</p>

			<div
				class="bg-white p-3 rounded-sm max-w-64 mx-auto [&>svg]:w-full [&>svg]:h-auto"
				role="img"
				aria-label="Código QR de transferencia"
				v-html="qr"
			/>

			<p class="text-sm text-center">Expira en {{ remaining }}</p>

			<div class="flex flex-wrap gap-3 justify-center">
				<VButton color="lemon" @click="copyLink">
					{{ copied ? "Enlace copiado" : "Copiar enlace" }}
				</VButton>
				<VButton @click="stop">Cancelar</VButton>
			</div>
		</div>

		<div v-else class="space-y-2">
			<p v-if="status === 'received'">
				¡Listo! El otro teléfono recibió los datos. Siguen guardados también en
				este teléfono. Si ya no lo usarás, desactiva aquí las notificaciones.
			</p>
			<p v-else>El código expiró sin usarse.</p>

			<VButton @click="stop">Aceptar</VButton>
		</div>

		<p v-if="error" class="text-sm text-chili-600">{{ error }}</p>
	</section>
</template>
