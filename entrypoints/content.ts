import { logger } from "@/libs/logger"
import { executeSearch } from "@/libs/search"

import {
	type WxtStorageItemType,
	extensionConfigState,
	initialAutoDebounceMs,
} from "@/libs/storage"
import { debounce } from "es-toolkit"
import hotkeys from "hotkeys-js"

type ExtensionConfig = WxtStorageItemType<typeof extensionConfigState.storage>

const main = () => {
	logger.info("Content Script loaded.")

	let _config: ExtensionConfig | null = null

	const debouncedWithSignalFunctionImpl = (
		source: string,
		selection: string,
	) => {
		if (!selection) return
		if (!_config) return
		logger.debug("debouncedWithSignalFunction:selection:", selection, _config)
		if (_config.mode === "auto") {
			if (selection.length < _config.auto_minTextLength) return
			if (selection.length > _config.auto_maxTextLength) return
		}
		if (
			_config.common_ignoreInput &&
			["INPUT", "TEXTAREA"].includes(document.activeElement?.nodeName ?? "")
		) {
			return
		}
		executeSearch(_config, source, selection)
	}

	const eventHandler = () => {
		const href = window.location.href
		const selection = window.getSelection()?.toString()
		logger.log("eventHandler:called", href, selection)
		if (!selection) return
		debouncedWithSignalFunctionImpl(href, selection)
	}
	let debounceEventHandler = debounce(eventHandler, initialAutoDebounceMs)

	const init = (event: string, config: ExtensionConfig) => {
		_config = config
		clearExtension()
		if (!config.enabled) return
		if (config.mode === "auto") {
			logger.log(event, "handleSelectionChange registered.")
			debounceEventHandler = debounce(eventHandler, config.auto_debounceMs)
			document.addEventListener("selectionchange", debounceEventHandler)
		} else {
			// manual
			logger.log(event, "page hotkeys registered.")
			hotkeys(config.manual_shortcutKeys, eventHandler)
		}
	}

	const clearExtension = () => {
		hotkeys.unbind()
		document.removeEventListener("selectionchange", debounceEventHandler)
		debounceEventHandler.cancel()
	}

	const initExtension = () => {
		extensionConfigState.storage.getValue().then((config) => {
			if (!config.enabled) return
			init("initExtension.storage.getValue", config)
		})
	}

	const syncExtension = () => {
		extensionConfigState.storage.watch((config) => {
			if (!config.enabled) {
				clearExtension()
			} else {
				init("syncExtension.watch", config)
			}
		})
	}

	initExtension()
	syncExtension()

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			clearExtension()
		} else {
			initExtension()
		}
	})
}

export default defineContentScript({
	matches: ["<all_urls>"],
	main,
})
