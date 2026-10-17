// Generates a VAPID key pair. The public key goes to wrangler.jsonc and the
// app's VITE_VAPID_PUBLIC_KEY, the private key goes to `wrangler secret put`.
const { publicKey, privateKey } = await crypto.subtle.generateKey(
	{ name: "ECDSA", namedCurve: "P-256" },
	true,
	["sign", "verify"]
)

const raw = new Uint8Array(await crypto.subtle.exportKey("raw", publicKey))
const { d } = await crypto.subtle.exportKey("jwk", privateKey)

console.log("VAPID_PUBLIC_KEY=" + Buffer.from(raw).toString("base64url"))
console.log("VAPID_PRIVATE_KEY=" + d)
