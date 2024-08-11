import { logger } from "@/libs/logger"

const handleSelectionChange = () => {
	const selection = window.getSelection()?.toString()
	if (!selection) return
	logger.log("sendMessage:", selection)
	browser.runtime.sendMessage(selection)
}

export default defineContentScript({
	matches: ["<all_urls>"],
	main() {
		logger.info("Content Script loaded.")
		document.addEventListener("selectionchange", handleSelectionChange)
	},
})
