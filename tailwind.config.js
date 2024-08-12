import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./entrypoints/**/*.{html,ts,tsx}",
		"./components/**/*.{html,ts,tsx}",
		// daisyUI
		"node_modules/daisyui/dist/**/*.js",
		"node_modules/react-daisyui/dist/**/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [daisyui],
}
