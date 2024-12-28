import { VitePWA } from "vite-plugin-pwa"
import { URL, fileURLToPath } from "url"
import { defineConfig } from "vite"
import basicSsl from "@vitejs/plugin-basic-ssl"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		vue({
			features: {
				optionsAPI: false,
			},
		}),
		basicSsl(),
		VitePWA({
			registerType: "prompt",
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: "Revisitas",
				short_name: "Revisitas",
				description: "Lleva un registro de tus revisitas localmente",
				background_color: "light-dark(#7FB069, #426233)",
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
