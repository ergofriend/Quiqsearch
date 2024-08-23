import { logger } from "@/libs/logger"
import { debounce } from "es-toolkit"

const searchWithGoogle = (keyword: string) => {
	const url = new URL("https://www.google.com/search")
	url.searchParams.set("q", keyword)
	window.open(url.toString(), "_blank")
	console.info("searchWithGoogle:", keyword)
}

export default defineContentScript({
	matches: ["<all_urls>"],
	main() {
		logger.info("Content Script loaded.")
		let controller = new AbortController()

		const init = (c: AbortController) => {
			const debounceMs = 2000
			const debouncedWithSignalFunction = debounce(
				(text: string) => {
					searchWithGoogle(text)
				},
				debounceMs,
				{ signal: c.signal },
			)

			const handleSelectionChange = () => {
				const selection = window.getSelection()?.toString()
				logger.log("handleSelectionChange:", selection)
				if (!selection) return
				debouncedWithSignalFunction(selection)
			}

			console.log("handleSelectionChange registered.")
			document.addEventListener("selectionchange", handleSelectionChange)
		}

		init(controller)

		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "hidden") {
				logger.info("Tab is hidden.")
				controller.abort()
			} else {
				logger.info("Tab is visible.")
				controller = new AbortController()
				init(controller)
			}
		})
	},
})
