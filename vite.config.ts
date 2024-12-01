import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vite"
import basicSsl from '@vitejs/plugin-basic-ssl'
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		basicSsl(),
		VitePWA({
			registerType: "prompt",
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: "return-visits",
				short_name: "return-visits",
				description: "Track all your return visits locally",
				theme_color: "#7FB069",
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},

			devOptions: {
				enabled: false,
				navigateFallback: "index.html",
				suppressWarnings: true,
				type: "module",
			},
		}),
	],
})
