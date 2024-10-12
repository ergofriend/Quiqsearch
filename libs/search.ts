import { evalCode } from "./eval"
import { logger } from "./logger"
import { searchMessaging } from "./messaging"
import type { WxtStorageItemType, extensionConfigState } from "./storage"

type ExtensionConfig = WxtStorageItemType<typeof extensionConfigState.storage>

const findFilter = (config: ExtensionConfig, currentTabUrl: string) => {
	const userFilter = config.custom_user_filters.find((f) =>
		new RegExp(f.siteRegExp).test(currentTabUrl),
	)
	const filter = userFilter || config.custom_fallback_filter
	logger.debug("findFilter:", currentTabUrl, filter)
	return {
		generate: (keyword: string) =>
			evalCode({
				currentTabUrl,
				keyword,
				code: filter.rawCode,
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
		const target = await findFilter(config, currentTabUrl).generate(
			selectedText,
		)

		await searchMessaging.sendMessage("searchOnTab", {
			type: "exact",
			url: target,
		})
	} catch (error) {
		logger.error("executeSearch:", error)

		// fallback to auto search
		await searchMessaging.sendMessage("searchOnTab", {
			type: "auto",
			keyword: selectedText,
		})
	}

	logger.info("executeSearch:", { config, currentTabUrl, selectedText })
}
