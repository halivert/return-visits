const IV_LENGTH = 12
export const PBKDF2_ITERATIONS = 600_000

async function streamThrough(
	bytes: Uint8Array,
	transform: CompressionStream | DecompressionStream
): Promise<Uint8Array> {
	const stream = new Blob([bytes]).stream().pipeThrough(transform)

	return new Uint8Array(await new Response(stream).arrayBuffer())
}

export function compress(text: string): Promise<Uint8Array> {
	return streamThrough(
		new TextEncoder().encode(text),
		new CompressionStream("gzip")
	)
}

export async function decompress(bytes: Uint8Array): Promise<string> {
	const text = await streamThrough(bytes, new DecompressionStream("gzip"))

	return new TextDecoder().decode(text)
}

/** Random key used once, for phone to phone transfers */
export function generateKey(): Promise<CryptoKey> {
	return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
		"encrypt",
		"decrypt",
	])
}

export async function exportKey(key: CryptoKey): Promise<Uint8Array> {
	return new Uint8Array(await crypto.subtle.exportKey("raw", key))
}

export function importKey(bytes: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["decrypt"])
}

/** Key for backup files, derived from the password the user chooses */
export async function deriveKey(
	password: string,
	salt: Uint8Array,
	iterations = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
	const baseKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveKey"]
	)

	return crypto.subtle.deriveKey(
		{ name: "PBKDF2", hash: "SHA-256", salt, iterations },
		baseKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	)
}

/** Returns the iv followed by the ciphertext */
export async function encrypt(
	key: CryptoKey,
	data: Uint8Array
): Promise<Uint8Array> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
	const ciphertext = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		data
	)

	const result = new Uint8Array(IV_LENGTH + ciphertext.byteLength)
	result.set(iv)
	result.set(new Uint8Array(ciphertext), IV_LENGTH)

	return result
}

export async function decrypt(
	key: CryptoKey,
	data: Uint8Array
): Promise<Uint8Array> {
	try {
		const plaintext = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: data.slice(0, IV_LENGTH) },
			key,
			data.slice(IV_LENGTH)
		)

		return new Uint8Array(plaintext)
	} catch {
		throw new Error("No se pudieron descifrar los datos")
	}
}
