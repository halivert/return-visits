import {
	buildPushPayload,
	type PushSubscription,
	type VapidKeys,
} from "@block65/webcrypto-web-push"

interface Env {
	DB: D1Database
	ALLOWED_ORIGINS: string
	VAPID_SUBJECT: string
	VAPID_PUBLIC_KEY: string
	VAPID_PRIVATE_KEY: string
	TRANSFER_LIMITER: RateLimit
}

interface Reminder {
	uuid: string
	sendAt: number
}

interface DueReminder {
	device_id: string
	uuid: string
	endpoint: string
	p256dh: string
	auth: string
}

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const BASE64URL_REGEX = /^[A-Za-z0-9_-]+=*$/
const MAX_REMINDERS = 2000
const HOUR_IN_MILIS = 60 * 60 * 1000

/** Reminders that couldn't be delivered within this window are dropped */
const STALE_AFTER = HOUR_IN_MILIS

/** Pushes sent per cron run, keeps us under the free plan subrequest limit */
const PUSHES_PER_RUN = 40

/** Time the other phone has to download a transfer */
const TRANSFER_TTL = 10 * 60 * 1000

/** D1 limit for a single value */
const MAX_TRANSFER_BYTES = 2_000_000

class HttpError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message)
	}
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
	const origin = request.headers.get("origin") ?? ""
	const allowed = env.ALLOWED_ORIGINS.split(",").map((item) => item.trim())

	if (!allowed.includes(origin)) return {}

	return {
		"access-control-allow-origin": origin,
		"access-control-allow-methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
		"access-control-allow-headers": "authorization, content-type",
		"access-control-max-age": "86400",
		vary: "origin",
	}
}

async function sha256(value: string): Promise<string> {
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(value)
	)

	return [...new Uint8Array(digest)]
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("")
}

async function authorize(request: Request, env: Env, deviceId: string) {
	const token = request.headers
		.get("authorization")
		?.match(/^Bearer (\S{32,})$/)?.[1]

	if (!token) throw new HttpError(401, "Missing token")

	const tokenHash = await sha256(token)
	const device = await env.DB.prepare(
		"SELECT token_hash FROM devices WHERE id = ?"
	)
		.bind(deviceId)
		.first<{ token_hash: string }>()

	if (device && device.token_hash !== tokenHash) {
		throw new HttpError(403, "Invalid token")
	}

	return { tokenHash, exists: !!device }
}

function parseSubscription(value: unknown): PushSubscription {
	const subscription = value as Partial<PushSubscription> | undefined
	const { endpoint, keys } = subscription ?? {}

	if (typeof endpoint !== "string" || endpoint.length > 2048) {
		throw new HttpError(400, "Invalid endpoint")
	}

	if (!URL.canParse(endpoint) || new URL(endpoint).protocol !== "https:") {
		throw new HttpError(400, "Invalid endpoint")
	}

	for (const key of [keys?.p256dh, keys?.auth]) {
		if (
			typeof key !== "string" ||
			key.length > 256 ||
			!BASE64URL_REGEX.test(key)
		) {
			throw new HttpError(400, "Invalid subscription keys")
		}
	}

	return { endpoint, expirationTime: null, keys: keys! }
}

function parseReminders(value: unknown): Reminder[] {
	if (!Array.isArray(value) || value.length > MAX_REMINDERS) {
		throw new HttpError(400, "Invalid reminders")
	}

	const minSendAt = Date.now() - STALE_AFTER

	return value
		.map((reminder: Partial<Reminder>) => {
			if (
				typeof reminder?.uuid !== "string" ||
				!UUID_REGEX.test(reminder.uuid) ||
				!Number.isSafeInteger(reminder.sendAt)
			) {
				throw new HttpError(400, "Invalid reminder")
			}

			return { uuid: reminder.uuid.toLowerCase(), sendAt: reminder.sendAt! }
		})
		.filter((reminder) => reminder.sendAt > minSendAt)
}

/**
 * Registers the device (or refreshes its subscription) and replaces all of its
 * reminders.
 */
async function putDevice(request: Request, env: Env, deviceId: string) {
	const { tokenHash } = await authorize(request, env, deviceId)

	const body = await request
		.json<{ subscription?: unknown; reminders?: unknown }>()
		.catch(() => {
			throw new HttpError(400, "Invalid JSON")
		})
	const subscription = parseSubscription(body?.subscription)
	const reminders = parseReminders(body?.reminders)

	await env.DB.batch([
		env.DB.prepare(
			`INSERT INTO devices (id, token_hash, endpoint, p256dh, auth, updated_at)
			VALUES (?1, ?2, ?3, ?4, ?5, ?6)
			ON CONFLICT (id) DO UPDATE SET
				endpoint = excluded.endpoint,
				p256dh = excluded.p256dh,
				auth = excluded.auth,
				updated_at = excluded.updated_at`
		).bind(
			deviceId,
			tokenHash,
			subscription.endpoint,
			subscription.keys.p256dh,
			subscription.keys.auth,
			Date.now()
		),
		env.DB.prepare("DELETE FROM reminders WHERE device_id = ?").bind(deviceId),
		env.DB.prepare(
			`INSERT OR REPLACE INTO reminders (device_id, uuid, send_at)
			SELECT ?1, json_extract(value, '$.uuid'), json_extract(value, '$.sendAt')
			FROM json_each(?2)`
		).bind(deviceId, JSON.stringify(reminders)),
	])

	return new Response(null, { status: 204 })
}

async function deleteDevice(request: Request, env: Env, deviceId: string) {
	const { exists } = await authorize(request, env, deviceId)

	if (exists) {
		await env.DB.batch([
			env.DB.prepare("DELETE FROM reminders WHERE device_id = ?").bind(
				deviceId
			),
			env.DB.prepare("DELETE FROM devices WHERE id = ?").bind(deviceId),
		])
	}

	return new Response(null, { status: 204 })
}

async function createTransfer(request: Request, env: Env) {
	const ip = request.headers.get("cf-connecting-ip") ?? "unknown"
	const { success } = await env.TRANSFER_LIMITER.limit({ key: ip })
	if (!success) throw new HttpError(429, "Too many transfers")

	const length = Number(request.headers.get("content-length"))
	if (!length || length > MAX_TRANSFER_BYTES) {
		throw new HttpError(413, "Invalid size")
	}

	const data = await request.arrayBuffer()
	if (data.byteLength > MAX_TRANSFER_BYTES) {
		throw new HttpError(413, "Invalid size")
	}

	const id = crypto.randomUUID()
	const expiresAt = Date.now() + TRANSFER_TTL

	await env.DB.prepare(
		"INSERT INTO transfers (id, data, expires_at) VALUES (?, ?, ?)"
	)
		.bind(id, data, expiresAt)
		.run()

	return Response.json({ id, expiresAt }, { status: 201 })
}

/** Transfers can be downloaded only once */
async function downloadTransfer(env: Env, id: string) {
	const transfer = await env.DB.prepare(
		"DELETE FROM transfers WHERE id = ? AND expires_at > ? RETURNING data"
	)
		.bind(id, Date.now())
		.first<{ data: ArrayBuffer | number[] }>()

	if (!transfer) throw new HttpError(404, "Transfer not found or expired")

	return new Response(new Uint8Array(transfer.data), {
		headers: {
			"content-type": "application/octet-stream",
			"cache-control": "no-store",
		},
	})
}

/** Lets the sending phone know when the transfer was picked up */
async function transferStatus(env: Env, id: string) {
	const transfer = await env.DB.prepare(
		"SELECT 1 FROM transfers WHERE id = ? AND expires_at > ?"
	)
		.bind(id, Date.now())
		.first()

	return new Response(null, {
		status: transfer ? 204 : 404,
		headers: { "cache-control": "no-store" },
	})
}

async function cancelTransfer(env: Env, id: string) {
	await env.DB.prepare("DELETE FROM transfers WHERE id = ?").bind(id).run()

	return new Response(null, { status: 204 })
}

async function route(request: Request, env: Env): Promise<Response> {
	const { pathname } = new URL(request.url)
	const [, resource, rawId, ...rest] = pathname.split("/")
	const id = rawId?.toLowerCase()

	if (resource === "transfers" && !id && request.method === "POST") {
		return createTransfer(request, env)
	}

	if (!id || !UUID_REGEX.test(id) || rest.length) {
		throw new HttpError(404, "Not found")
	}

	const handler = `${request.method} ${resource}`

	switch (handler) {
		case "PUT devices":
			return putDevice(request, env, id)
		case "DELETE devices":
			return deleteDevice(request, env, id)
		case "GET transfers":
			return downloadTransfer(env, id)
		case "HEAD transfers":
			return transferStatus(env, id)
		case "DELETE transfers":
			return cancelTransfer(env, id)
		default:
			throw new HttpError(404, "Not found")
	}
}

async function sendReminder(reminder: DueReminder, env: Env) {
	const vapid: VapidKeys = {
		subject: env.VAPID_SUBJECT,
		publicKey: env.VAPID_PUBLIC_KEY,
		privateKey: env.VAPID_PRIVATE_KEY,
	}

	const payload = await buildPushPayload(
		{
			data: { uuid: reminder.uuid },
			options: { ttl: HOUR_IN_MILIS / 1000, urgency: "high" },
		},
		{
			endpoint: reminder.endpoint,
			expirationTime: null,
			keys: { p256dh: reminder.p256dh, auth: reminder.auth },
		},
		vapid
	)

	const response = await fetch(reminder.endpoint, payload)

	return response.status
}

async function sendDueReminders(env: Env) {
	const now = Date.now()

	await env.DB.prepare("DELETE FROM reminders WHERE send_at < ?")
		.bind(now - STALE_AFTER)
		.run()

	const { results } = await env.DB.prepare(
		`SELECT r.device_id, r.uuid, d.endpoint, d.p256dh, d.auth
		FROM reminders r
		JOIN devices d ON d.id = r.device_id
		WHERE r.send_at <= ?
		ORDER BY r.send_at
		LIMIT ?`
	)
		.bind(now, PUSHES_PER_RUN)
		.all<DueReminder>()

	if (!results.length) return

	const statuses = await Promise.allSettled(
		results.map((reminder) => sendReminder(reminder, env))
	)

	const sent: [string, string][] = []
	const goneDevices = new Set<string>()

	statuses.forEach((status, index) => {
		const reminder = results[index]

		if (status.status === "rejected") {
			console.error("Push failed", status.reason)
			return
		}

		if (status.value >= 200 && status.value < 300) {
			sent.push([reminder.device_id, reminder.uuid])
		} else if (status.value === 404 || status.value === 410) {
			// The subscription expired or the user revoked the permission
			goneDevices.add(reminder.device_id)
		} else {
			// Retried on next run until it gets stale
			console.error("Push rejected", status.value)
		}
	})

	await env.DB.batch([
		env.DB.prepare(
			`DELETE FROM reminders WHERE (device_id, uuid) IN (
				SELECT json_extract(value, '$[0]'), json_extract(value, '$[1]')
				FROM json_each(?)
			)`
		).bind(JSON.stringify(sent)),
		env.DB.prepare(
			"DELETE FROM reminders WHERE device_id IN (SELECT value FROM json_each(?))"
		).bind(JSON.stringify([...goneDevices])),
		env.DB.prepare(
			"DELETE FROM devices WHERE id IN (SELECT value FROM json_each(?))"
		).bind(JSON.stringify([...goneDevices])),
	])
}

export default {
	async fetch(request, env) {
		const cors = corsHeaders(request, env)

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: cors })
		}

		let response: Response

		try {
			response = await route(request, env)
		} catch (error) {
			const status = error instanceof HttpError ? error.status : 500
			if (status === 500) console.error(error)

			response = Response.json(
				{ error: error instanceof HttpError ? error.message : "Server error" },
				{ status }
			)
		}

		Object.entries(cors).forEach(([key, value]) =>
			response.headers.set(key, value)
		)

		return response
	},

	async scheduled(_controller, env) {
		await env.DB.prepare("DELETE FROM transfers WHERE expires_at <= ?")
			.bind(Date.now())
			.run()

		await sendDueReminders(env)
	},
} satisfies ExportedHandler<Env>
