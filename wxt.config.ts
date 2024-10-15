import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	imports: false,
	manifest(env) {
		const base = {
			name: "__MSG_app_title__",
			description: "__MSG_app_description__",
			default_locale: "en",
			permissions: ["storage", "search"],
		}

		if (env.browser === "chrome") return base

		return {
			...base,
			browser_specific_settings: {
				gecko: {
					id: "quiqsearch@kasu.dev",
				},
			},
			content_security_policy:
				"script-src 'self' https://esm.sh/; object-src 'self'; worker-src 'self' blob:",
		}
	},
	vite(env) {
		if (env.browser === "chrome") return {}

		return {
			build: {
				rollupOptions: {
					external: [
						"monaco-editor/esm/vs/language/typescript/ts.worker?worker",
					],
					output: {
						paths: {
							"monaco-editor/esm/vs/language/typescript/ts.worker?worker":
								"https://esm.sh/v135/monaco-editor@0.52.0/esm/vs/language/typescript/ts.worker?worker",
						},
					},
				},
			},
		}
	},
})
