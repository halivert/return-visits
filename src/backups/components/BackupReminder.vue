<script setup lang="ts">
import { useRoute } from "vue-router"
import VButton from "@/components/VButton.vue"
import {
	snoozeBackupReminder,
	useBackupReminder,
} from "@/backups/backupStatus"

const route = useRoute()
const showReminder = useBackupReminder()
</script>

<template>
	<aside
		v-if="showReminder && route.name !== 'Config'"
		class="max-w-prose mx-auto px-3 py-2 mb-2 flex flex-wrap gap-2 items-center bg-lemon-100 dark:bg-lemon-950"
		role="status"
	>
		<p class="grow text-sm">Tienes cambios sin respaldar desde hace días.</p>

		<VButton color="asparagus" :href="{ name: 'Config' }">Respaldar</VButton>
		<VButton @click="snoozeBackupReminder">Más tarde</VButton>
	</aside>
</template>
