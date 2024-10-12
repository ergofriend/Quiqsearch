import type {
	StorageItemKey,
	WxtStorageItem,
	WxtStorageItemOptions,
} from "wxt/storage"
import { type Filter, filterConfig } from "./filter"

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

type ExtensionConfig_v1 = {
	enabled: boolean
	common_ignoreInput: boolean
	common_filter_enabledExtensions: boolean
	common_filter_extension_YouTube: boolean
	common_filter_extension_X: boolean
	mode: "auto" | "manual"
	auto_minTextLength: number
	auto_maxTextLength: number
	auto_debounceMs: number
	manual_shortcutKeys: string
}

type ExtensionConfig_v2 = {
	enabled: boolean
	common_ignoreInput: boolean
	custom_fallback_filter: Filter
	custom_user_filters: Filter[]
	mode: "auto" | "manual"
	auto_minTextLength: number
	auto_maxTextLength: number
	auto_debounceMs: number
	manual_shortcutKeys: string
}

export const initialAutoDebounceMs = 1500

export const extensionConfigState = defineItemWithKey<ExtensionConfig_v2>(
	"sync:config",
	{
		fallback: {
			enabled: true,
			common_ignoreInput: true,
			custom_fallback_filter: filterConfig.initial,
			custom_user_filters: [],
			mode: "auto",
			manual_shortcutKeys: "Ctrl + P",
			auto_minTextLength: 3,
			auto_maxTextLength: 50,
			auto_debounceMs: initialAutoDebounceMs,
		},
		version: 2,
		migrations: {
			2: (_config: ExtensionConfig_v1): ExtensionConfig_v2 => {
				const custom_user_filters: Array<Filter> = []

				// copy old settings
				if (_config.common_filter_enabledExtensions) {
					if (_config.common_filter_extension_YouTube) {
						custom_user_filters.push(filterConfig.YouTube)
					}
					if (_config.common_filter_extension_X) {
						custom_user_filters.push(filterConfig.X)
					}
				}

				const {
					common_filter_enabledExtensions,
					common_filter_extension_YouTube,
					common_filter_extension_X,
					// drop old settings
					...newConfig
				} = _config

				return {
					...newConfig,
					// set new settings
					custom_fallback_filter: filterConfig.initial,
					custom_user_filters: custom_user_filters,
				}
			},
		},
	},
)
