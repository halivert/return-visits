import { useLocalStorage } from "@vueuse/core"

export const REMINDER_BUFFERS = [
	{ minutes: 15, label: "15 minutos antes" },
	{ minutes: 30, label: "30 minutos antes" },
	{ minutes: 60, label: "1 hora antes" },
] as const

export type ReminderBuffer = (typeof REMINDER_BUFFERS)[number]["minutes"]

export interface Device {
	/** Random id, the push server doesn't know anything else about the device */
	id: string
	/** Secret to prove this device owns its id */
	token: string
}

interface NotificationSettings {
	device: Device | null
	buffer: ReminderBuffer
}

export const notificationSettings = useLocalStorage<NotificationSettings>(
	"notifications",
	{ device: null, buffer: 30 },
	{ mergeDefaults: true }
)

export const pushApiUrl: string | undefined = import.meta.env.VITE_PUSH_API_URL
export const vapidPublicKey: string | undefined =
	import.meta.env.VITE_VAPID_PUBLIC_KEY

export function isPushSupported() {
	return (
		!!pushApiUrl &&
		!!vapidPublicKey &&
		"serviceWorker" in navigator &&
		"PushManager" in window &&
		"Notification" in window
	)
}
