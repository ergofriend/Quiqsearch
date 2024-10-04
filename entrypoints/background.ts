import { searchMessaging } from "@/libs/messaging"

export default defineBackground({
	type: "module",
	main() {
		searchMessaging.onMessage("searchOnTab", async ({ data: { url } }) => {
			await browser.tabs.create({ url })
		})
	},
})
