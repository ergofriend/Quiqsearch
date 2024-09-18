import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	manifest: {
		name: "__MSG_app_title__",
		description: "__MSG_app_description__",
		default_locale: "en",
		permissions: ["storage"],
		applications: {
			gecko: {
				id: "quiqsearch@kasu.dev",
			},
		},
	},
})
