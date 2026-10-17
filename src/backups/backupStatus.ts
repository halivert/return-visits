import { useLocalStorage } from "@vueuse/core"

interface BackupStatus {
	lastBackupAt: number | null
}

export const backupStatus = useLocalStorage<BackupStatus>(
	"backup-status",
	{ lastBackupAt: null },
	{ mergeDefaults: true }
)

export function markBackedUp() {
	backupStatus.value.lastBackupAt = Date.now()
}

export async function requestPersistentStorage(): Promise<boolean> {
	if (!navigator.storage?.persist) return false
	if (await navigator.storage.persisted()) return true

	return navigator.storage.persist()
}
