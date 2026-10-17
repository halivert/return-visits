export function bytesToBase64Url(bytes: Uint8Array): string {
	let binary = ""
	bytes.forEach((byte) => (binary += String.fromCharCode(byte)))

	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function base64UrlToBytes(value: string): Uint8Array {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
	const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))

	return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}
