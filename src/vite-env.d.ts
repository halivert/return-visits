/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />

interface ImportMetaEnv {
	readonly VITE_PUSH_API_URL?: string
	readonly VITE_VAPID_PUBLIC_KEY?: string
}
