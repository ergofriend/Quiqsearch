import type {
	StorageItemKey,
	WxtStorageItem,
	WxtStorageItemOptions,
} from "wxt/storage"

export type WxtStorageItemType<T> = T extends WxtStorageItem<
	infer U,
	Record<string, unknown>
>
	? U
	: never

export type WxtStorageItemWithKey<T> = {
	key: StorageItemKey
	storage: WxtStorageItem<T, Record<string, unknown>>
}

const defineItemWithKey = <T>(
	key: StorageItemKey,
	options: WxtStorageItemOptions<T>,
) => ({
	key,
	storage: storage.defineItem<T>(key, options),
})

type ExtensionConfig = {
	enabled: boolean
	common_ignoreInput: boolean
	common_filter_enabledExtensions: boolean
	common_filter_extension_YouTube: boolean
	common_filter_extension_X: boolean
	custom_fallback_filter: { siteRegExp: string; code: string }
	custom_user_filters: { siteRegExp: string; code: string }[]
	mode: "auto" | "manual"
	auto_minTextLength: number
	auto_maxTextLength: number
	auto_debounceMs: number
	manual_shortcutKeys: string
}

export const initialAutoDebounceMs = 1500

export const initialFilter = {
	siteRegExp: "*",
	// TODO: add Props type
	code: `({currentTabUrl, keyword, URLSearchParams}) => {
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
}`,
}

const YouTubeFilter = {
	siteRegExp: "youtube.com",
	// TODO: add Props type
	code: `({currentTabUrl, keyword, URLSearchParams}) => {
	URLSearchParams.set("search_query", keyword)
	return "https://www.youtube.com/results?" + URLSearchParams.toString()
}`,
}

const XFilter = {
	siteRegExp: "x.com",
	// TODO: add Props type
	code: `({currentTabUrl, keyword, URLSearchParams}) => {
	URLSearchParams.set("q", keyword)
	return "https://x.com/search?" + URLSearchParams.toString()
}`,
}

export const extensionConfigState = defineItemWithKey<ExtensionConfig>(
	"sync:config",
	{
		fallback: {
			enabled: true,
			common_ignoreInput: true,
			common_filter_enabledExtensions: true,
			common_filter_extension_YouTube: true,
			common_filter_extension_X: true,
			custom_fallback_filter: initialFilter,
			custom_user_filters: [YouTubeFilter, XFilter],
			mode: "auto",
			manual_shortcutKeys: "Ctrl + P",
			auto_minTextLength: 3,
			auto_maxTextLength: 50,
			auto_debounceMs: initialAutoDebounceMs,
		},
	},
)
