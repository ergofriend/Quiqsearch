import { logger } from "@/libs/logger"

export default defineBackground(() => {
	logger.info("background loaded.", { id: browser.runtime.id })
	browser.runtime.onMessage.addListener((message) => {
		if (typeof message !== "string") return
		console.log("onMessage:", message)
	})
})
