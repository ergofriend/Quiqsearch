import { logger } from "@/libs/logger"
import { executeSearch } from "@/libs/search"

export default defineBackground(() => {
	logger.info("background loaded.", { id: browser.runtime.id })

	const state = {
		selectedText: "",
	}

	browser.runtime.onMessage.addListener((message) => {
		if (typeof message !== "string") return
		console.log("onMessage:", message)
		state.selectedText = message
	})
	browser.commands.onCommand.addListener((command, tabs) => {
		console.log(`Command: ${command}`, tabs, state)
		executeSearch("", state.selectedText)
	})
})
