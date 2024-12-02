import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import vue from "@vitejs/plugin-vue"
import { URL, fileURLToPath } from "url"

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@people": fileURLToPath(new URL("./src/people", import.meta.url)),
			"@return-visits": fileURLToPath(
				new URL("./src/return-visits", import.meta.url)
			),
		},
	},
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
