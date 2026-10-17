import { base64UrlToBytes, bytesToBase64Url } from "@/base64"
import {
	BackupData,
	collectBackupData,
	parseBackupData,
} from "@/backups/backupData"
import {
	compress,
	decompress,
	decrypt,
	encrypt,
	exportKey,
	generateKey,
	importKey,
} from "@/backups/encryption"

const apiUrl: string | undefined = import.meta.env.VITE_PUSH_API_URL
const TRANSFER_HASH = "#transfer="
const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface Transfer {
	id: string
	expiresAt: number
	/** Link with the id and the key, the key never reaches the server */
	url: string
}

export interface TransferCode {
	id: string
	key: string
}

export function isTransferSupported() {
	return !!apiUrl && "CompressionStream" in window
}

/** Encrypts all data with a random key and uploads it for a few minutes */
export async function createTransfer(): Promise<Transfer> {
	const key = await generateKey()
	const data = await compress(JSON.stringify(await collectBackupData()))

	const response = await fetch(`${apiUrl}/transfers`, {
		method: "POST",
		headers: { "content-type": "application/octet-stream" },
		body: await encrypt(key, data),
	})

	if (response.status === 429) {
		throw new Error("Demasiados intentos, espera un minuto")
	}

	if (!response.ok) throw new Error("Error al preparar la transferencia")

	const { id, expiresAt }: { id: string; expiresAt: number } =
		await response.json()

	const code = `${id}.${bytesToBase64Url(await exportKey(key))}`
	const url = new URL(import.meta.env.BASE_URL, location.origin)
	url.hash = TRANSFER_HASH + code

	return { id, expiresAt, url: url.href }
}

/** `true` while the transfer is waiting to be downloaded */
export async function isTransferPending(id: string): Promise<boolean> {
	const response = await fetch(`${apiUrl}/transfers/${id}`, {
		method: "HEAD",
	})

	return response.ok
}

export async function cancelTransfer(id: string) {
	await fetch(`${apiUrl}/transfers/${id}`, { method: "DELETE" })
}

/** Reads the code from a transfer link or its hash */
export function parseTransferCode(value: string): TransferCode | null {
	const hash = value.slice(value.indexOf(TRANSFER_HASH))
	if (!hash.startsWith(TRANSFER_HASH)) return null

	const [id, key] = hash.slice(TRANSFER_HASH.length).split(".")
	if (!id || !key || !UUID_REGEX.test(id)) return null

	return { id, key }
}

export function hasTransferCode(hash: string) {
	return hash.startsWith(TRANSFER_HASH)
}

export async function downloadTransfer({
	id,
	key,
}: TransferCode): Promise<BackupData> {
	const response = await fetch(`${apiUrl}/transfers/${id}`)

	if (response.status === 404) {
		throw new Error(
			"La transferencia ya fue usada o expiró, genera un nuevo código"
		)
	}

	if (!response.ok) throw new Error("Error al descargar los datos")

	const cryptoKey = await importKey(base64UrlToBytes(key))
	const data = await decrypt(
		cryptoKey,
		new Uint8Array(await response.arrayBuffer())
	)

	return parseBackupData(JSON.parse(await decompress(data)))
}
