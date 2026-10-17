<script setup lang="ts">
import { computed, ref, watch } from "vue"
import VButton from "@/components/VButton.vue"
import VSelect from "@/components/form/VSelect.vue"
import {
	isPushSupported,
	notificationSettings,
	REMINDER_BUFFERS,
} from "@/notifications/notificationSettings"
import {
	disableNotifications,
	enableNotifications,
	syncReminders,
} from "@/notifications/reminders"

const supported = isPushSupported()
const enabled = computed(() => !!notificationSettings.value.device)
const loading = ref(false)
const error = ref("")

async function run(action: () => Promise<void>) {
	loading.value = true
	error.value = ""

	try {
		await action()
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Error desconocido"
	} finally {
		loading.value = false
	}
}

watch(
	() => notificationSettings.value.buffer,
	() => run(syncReminders)
)
</script>

<template>
	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Notificaciones</h2>

		<p v-if="!supported" class="text-sm">
			Este navegador no permite notificaciones. En iPhone primero agrega la
			aplicación a la pantalla de inicio.
		</p>

		<template v-else>
			<p class="text-sm">
				Recibe un aviso antes de cada revisita. El servidor solo guarda un
				identificador aleatorio y la hora del aviso, nunca nombres ni notas.
			</p>

			<div class="flex flex-wrap gap-3 items-center">
				<VButton
					:color="enabled ? 'lemon' : 'asparagus'"
					:loading="loading"
					@click="run(enabled ? disableNotifications : enableNotifications)"
				>
					{{ enabled ? "Desactivar notificaciones" : "Activar notificaciones" }}
				</VButton>

				<label class="sr-only" for="reminder-buffer">Avisarme</label>
				<VSelect
					id="reminder-buffer"
					div-class="flex-1 min-w-40"
					v-model="notificationSettings.buffer"
					:disabled="!enabled || loading"
					hide-errors
				>
					<option
						v-for="buffer in REMINDER_BUFFERS"
						:key="buffer.minutes"
						:value="buffer.minutes"
					>
						{{ buffer.label }}
					</option>
				</VSelect>
			</div>

			<p v-if="error" class="text-sm text-chili-600">{{ error }}</p>
		</template>
	</section>
</template>
