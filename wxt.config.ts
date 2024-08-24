import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	manifest: {
		name: "__MSG_app_title__",
		description: "__MSG_app_description__",
		default_locale: "en",
		permissions: ["storage"],
		commands: {
			manual: {
				description: "__MSG_manual_command_description__",
				suggested_key: { default: "Ctrl+P", mac: "Command+P" },
			},
		},
	},
})
