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

type ExtensionConfig = {
	enabled: boolean
	common_ignoreInput: boolean
	common_filter_enabledExtensions: boolean
	common_filter_extension_YouTube: boolean
	common_filter_extension_X: boolean
	custom_fallback_filter: Filter
	custom_user_filters: Filter[]
	mode: "auto" | "manual"
	auto_minTextLength: number
	auto_maxTextLength: number
	auto_debounceMs: number
	manual_shortcutKeys: string
}

export const initialAutoDebounceMs = 1500

export const extensionConfigState = defineItemWithKey<ExtensionConfig>(
	"sync:config",
	{
		fallback: {
			enabled: true,
			common_ignoreInput: true,
			common_filter_enabledExtensions: true,
			common_filter_extension_YouTube: true,
			common_filter_extension_X: true,
			custom_fallback_filter: filterConfig.initial,
			custom_user_filters: [filterConfig.YouTube, filterConfig.X],
			mode: "auto",
			manual_shortcutKeys: "Ctrl + P",
			auto_minTextLength: 3,
			auto_maxTextLength: 50,
			auto_debounceMs: initialAutoDebounceMs,
		},
	},
)
