import { computed } from "vue"
import { useLocalStorage, useNow } from "@vueuse/core"
import { DAY_IN_MILIS } from "@/constants"

interface BackupStatus {
	lastBackupAt: number | null
	/** Date of the oldest change not included in a backup */
	pendingSince: number | null
	snoozedUntil: number | null
}

/** Days with changes not backed up before reminding the user */
const REMIND_AFTER = 7 * DAY_IN_MILIS
const SNOOZE = 3 * DAY_IN_MILIS

export const backupStatus = useLocalStorage<BackupStatus>(
	"backup-status",
	{ lastBackupAt: null, pendingSince: null, snoozedUntil: null },
	{ mergeDefaults: true }
)

export function markChanged() {
	backupStatus.value.pendingSince ??= Date.now()
}

export function markBackedUp() {
	backupStatus.value.lastBackupAt = Date.now()
	backupStatus.value.pendingSince = null
	backupStatus.value.snoozedUntil = null
}

export function snoozeBackupReminder() {
	backupStatus.value.snoozedUntil = Date.now() + SNOOZE
}

export function useBackupReminder() {
	const now = useNow({ interval: 60 * 60 * 1000 })

	return computed(() => {
		const { pendingSince, snoozedUntil } = backupStatus.value
		const time = now.value.getTime()

		if (!pendingSince || time - pendingSince < REMIND_AFTER) return false

		return !snoozedUntil || time > snoozedUntil
	})
}

export async function requestPersistentStorage(): Promise<boolean> {
	if (!navigator.storage?.persist) return false
	if (await navigator.storage.persisted()) return true

	return navigator.storage.persist()
}
