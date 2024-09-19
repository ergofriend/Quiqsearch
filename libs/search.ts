import type { WxtStorageItemType, extensionConfigState } from "./storage"

type ExtensionConfig = WxtStorageItemType<typeof extensionConfigState.storage>

type SearchFilter = {
	siteRegExp: string
	urlGenerator: (keyword: string) => string
}

const searchWithGoogle = (keyword: string) => {
	const url = new URL("https://www.google.com/search")
	url.searchParams.set("q", keyword)
	return url.toString()
}

const fallbackFilter: SearchFilter = {
	siteRegExp: "*",
	urlGenerator: searchWithGoogle,
}

const extensionYouTube: SearchFilter = {
	siteRegExp: "youtube.com",
	urlGenerator: (keyword) => {
		const url = new URL("https://www.youtube.com/results")
		url.searchParams.set("search_query", keyword)
		return url.toString()
	},
}

const extensionX: SearchFilter = {
	siteRegExp: "x.com",
	urlGenerator: (keyword) => {
		const url = new URL("https://x.com/search")
		url.searchParams.set("q", keyword)
		return url.toString()
	},
}

const findFilter = (
	config: ExtensionConfig,
	currentTabUrl: string,
): SearchFilter => {
	if (!config.common_filter_enabledExtensions) return fallbackFilter

	const filters = [
		config.common_filter_extension_YouTube && extensionYouTube,
		config.common_filter_extension_X && extensionX,
	].filter(Boolean) as SearchFilter[]
	const filter = filters.find((f) =>
		new RegExp(f.siteRegExp).test(currentTabUrl),
	)
	return filter || fallbackFilter
}

export const executeSearch = (
	config: ExtensionConfig,
	currentTabUrl: string,
	selectedText: string,
) => {
	if (!selectedText) return

	const target = findFilter(config, currentTabUrl).urlGenerator(selectedText)
	if (typeof window !== "undefined") {
		window.open(target, "_blank")
	} else {
		browser.tabs.create({ url: target })
	}
	console.info("executeSearch:", currentTabUrl, selectedText, target)
}
