import { evalCode } from "./eval"
import { SkipFilterRequest } from "./filter"
import { logger } from "./logger"
import { searchMessaging } from "./messaging"
import type { WxtStorageItemType, extensionConfigState } from "./storage"

type ExtensionConfig = WxtStorageItemType<typeof extensionConfigState.storage>

type ExecuteProps = {
	config: ExtensionConfig
	currentTabUrl: string
	keyword: string
}

export const executeSearch = async ({
	config,
	currentTabUrl,
	keyword,
}: ExecuteProps) => {
	if (!keyword) return

	// try eval custom filter
	try {
		const targetUrl = await _executeFilter({ config, currentTabUrl, keyword })

		if (!targetUrl) {
			throw new Error("filter is not matched")
		}

		await searchMessaging.sendMessage("searchOnTab", {
			type: "exact",
			url: targetUrl,
		})
		logger.info("executeSearch:exact:", { targetUrl })
	} catch (error) {
		logger.error("executeSearch:error:", error)

		// fallback to auto search
		await searchMessaging.sendMessage("searchOnTab", {
			type: "auto",
			keyword: keyword,
		})
		logger.info("executeSearch:auto:", { keyword })
	}
}

const _executeFilter = async ({
	config,
	currentTabUrl,
	keyword,
}: ExecuteProps): Promise<string | null> => {
	for (const filter of config.custom_user_filters) {
		if (
			filter.siteRegExp === "*" ||
			new RegExp(filter.siteRegExp).test(currentTabUrl)
		) {
			logger.debug("_executeFilter:filter:", filter)

			const result = await evalCode({
				currentTabUrl,
				keyword,
				code: filter.rawCode,
			})

			logger.debug("_executeFilter:result:", result)

			if (result !== SkipFilterRequest) {
				return result
			}
		}
	}

	return null
}
