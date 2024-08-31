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
	mode: "auto" | "manual"
	shortcutKeys: string
}

export const extensionConfigState = defineItemWithKey<ExtensionConfig>(
	"sync:config",
	{
		fallback: {
			enabled: true,
			mode: "auto",
			shortcutKeys: "Ctrl + P",
		},
	},
)
