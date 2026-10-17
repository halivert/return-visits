import { getAllFromStore } from "@/db/useDatabase"
import { MINUTE_IN_MILIS } from "@/constants"
import {
	Device,
	isPushSupported,
	notificationSettings,
	pushApiUrl,
	vapidPublicKey,
} from "@/notifications/notificationSettings"

function base64UrlToBytes(value: string): Uint8Array {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
	const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))

	return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function randomToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32))

	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "")
}

async function deviceRequest(device: Device, method: string, body?: unknown) {
	const response = await fetch(`${pushApiUrl}/devices/${device.id}`, {
		method,
		headers: {
			authorization: `Bearer ${device.token}`,
			"content-type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	})

	if (!response.ok) {
		throw new Error(`Error del servidor de notificaciones (${response.status})`)
	}
}

async function getSubscription(): Promise<PushSubscription | null> {
	const registration = await navigator.serviceWorker.ready
	const subscription = await registration.pushManager.getSubscription()

	if (subscription || Notification.permission !== "granted") {
		return subscription
	}

	// The browser dropped the subscription but we still have permission
	return registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64UrlToBytes(vapidPublicKey!),
	})
}

/**
 * Sends the uuid and notification time of every upcoming return visit, the
 * server replaces all reminders of this device with them.
 */
async function sendReminders() {
	const { device, buffer } = notificationSettings.value
	if (!device || !isPushSupported()) return

	const subscription = await getSubscription()

	if (!subscription) {
		// Permission was revoked from browser settings
		notificationSettings.value.device = null
		await deviceRequest(device, "DELETE").catch(() => {})
		return
	}

	const now = Date.now()
	const returnVisits = await getAllFromStore(
		"returnVisits",
		"returnDate",
		IDBKeyRange.lowerBound(new Date(now))
	)

	const reminders = returnVisits
		.map((returnVisit) => ({
			uuid: returnVisit.uuid,
			sendAt: returnVisit.returnDate.getTime() - buffer * MINUTE_IN_MILIS,
		}))
		.filter((reminder) => reminder.uuid && reminder.sendAt > now)

	await deviceRequest(device, "PUT", {
		subscription: subscription.toJSON(),
		reminders,
	})
}

let running: Promise<void> | undefined
let queued = false

/**
 * Syncs reminders with the push server. Calls made while a sync is running are
 * merged into a single sync after it.
 */
export async function syncReminders(): Promise<void> {
	if (running) {
		queued = true
		return running
	}

	running = sendReminders().finally(() => {
		running = undefined

		if (queued) {
			queued = false
			syncReminders().catch(console.error)
		}
	})

	return running
}

export async function enableNotifications() {
	const permission = await Notification.requestPermission()

	if (permission !== "granted") {
		throw new Error(
			"Permiso de notificaciones denegado, puedes activarlo en la configuración del navegador"
		)
	}

	const registration = await navigator.serviceWorker.ready
	await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: base64UrlToBytes(vapidPublicKey!),
	})

	notificationSettings.value.device ??= {
		id: crypto.randomUUID(),
		token: randomToken(),
	}

	await syncReminders()
}

export async function disableNotifications() {
	const { device } = notificationSettings.value
	notificationSettings.value.device = null

	const registration = await navigator.serviceWorker.ready
	const subscription = await registration.pushManager.getSubscription()
	await subscription?.unsubscribe()

	if (device) await deviceRequest(device, "DELETE")
}
