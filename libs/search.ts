import { evalCode } from "./eval"
import { logger } from "./logger"
import { searchMessaging } from "./messaging"
import type { WxtStorageItemType, extensionConfigState } from "./storage"

type ExtensionConfig = WxtStorageItemType<typeof extensionConfigState.storage>

const findFilter = (config: ExtensionConfig, currentTabUrl: string) => {
	const userFilter = config.custom_user_filters.find((f) =>
		new RegExp(f.siteRegExp).test(currentTabUrl),
	)

	if (!userFilter) return null

	logger.debug("findFilter:", currentTabUrl, userFilter)
	return {
		generate: (keyword: string) =>
			evalCode({
				currentTabUrl,
				keyword,
				code: userFilter.rawCode,
			}),
	}
}

export const executeSearch = async (
	config: ExtensionConfig,
	currentTabUrl: string,
	selectedText: string,
) => {
	if (!selectedText) return

	// try eval custom filter
	try {
		const userFilter = findFilter(config, currentTabUrl)

		if (!userFilter) throw new Error("No filter found.")

		const targetUrl = await userFilter.generate(selectedText)
		await searchMessaging.sendMessage("searchOnTab", {
			type: "exact",
			url: targetUrl,
		})
	} catch (error) {
		logger.debug("executeSearch:", error)

		// fallback to auto search
		await searchMessaging.sendMessage("searchOnTab", {
			type: "auto",
			keyword: selectedText,
		})
	}

	logger.info("executeSearch:", { config, currentTabUrl, selectedText })
}
