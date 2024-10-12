import { logger } from "@/libs/logger"
import { searchMessaging } from "@/libs/messaging"

export default defineBackground({
	type: "module",
	main() {
		searchMessaging.onMessage("searchOnTab", async ({ data }) => {
			logger.debug("onMessage:searchOnTab:", data)
			switch (data.type) {
				case "exact":
					await browser.tabs.create({ url: data.url })
					break
				case "auto":
					await browser.search.query({
						disposition: "NEW_TAB",
						text: data.keyword,
					})
					break
				default:
					throw new Error("Unknown search type")
			}
		})
	},
})
