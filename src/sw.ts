/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core"
import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { getAllFromStore, getFromStore } from "./db/useDatabase"

declare let self: ServiceWorkerGlobalScope

self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
})

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")))
clientsClaim()

/**
 * The push only carries the return visit uuid, everything shown in the
 * notification is read from this device database.
 */
async function showReminder(uuid: unknown) {
	const [returnVisit] =
		typeof uuid === "string"
			? await getAllFromStore("returnVisits", "uuid", uuid, 1)
			: []

	if (!returnVisit) {
		return self.registration.showNotification("Revisitas", {
			body: "Tienes una revisita pendiente",
			icon: "favicon.webp",
			data: { url: self.registration.scope },
		})
	}

	const person = await getFromStore("people", returnVisit.personId).catch(
		() => undefined
	)

	const time = returnVisit.returnDate.toLocaleTimeString("es-MX", {
		hour: "numeric",
		minute: "2-digit",
	})

	return self.registration.showNotification(
		`Revisita con ${person?.name ?? "una persona"}`,
		{
			body: `A las ${time} · ${returnVisit.topic}`,
			icon: "favicon.webp",
			tag: returnVisit.uuid,
			data: {
				url: new URL(`people/${returnVisit.personId}`, self.registration.scope)
					.href,
			},
		}
	)
}

self.addEventListener("push", (event) => {
	let uuid: unknown

	try {
		uuid = event.data?.json()?.uuid
	} catch {
		uuid = undefined
	}

	event.waitUntil(showReminder(uuid))
})

self.addEventListener("notificationclick", (event) => {
	event.notification.close()

	const url: string = event.notification.data?.url ?? self.registration.scope

	event.waitUntil(
		(async () => {
			const windows = await self.clients.matchAll({
				type: "window",
				includeUncontrolled: true,
			})

			const client = windows.at(0)
			if (!client) return self.clients.openWindow(url)

			await client.focus()
			return client.navigate(url)
		})()
	)
})
