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

/**
 * ja: 拡張機能本体のオン・オフを管理するストレージ
 *
 * en: Storage to manage the on/off of the extension itself
 */
export const extensionFeatureState = defineItemWithKey("sync:enabled", {
	fallback: true,
})

/**
 * ja: 拡張機能のモードを管理するストレージ
 *
 * en: Storage to manage the mode of the extension
 */
export const extensionModeState = defineItemWithKey<"auto" | "manual">(
	"sync:mode",
	{
		fallback: "auto",
	},
)

/**
 * ja: 拡張機能のショートカットを管理するストレージ
 *
 * en: Storage to manage the shortcut of the extension
 */
export const extensionShortcutState = defineItemWithKey<string>(
	"sync:shortcut",
	{
		fallback: "Cmd + K",
	},
)
