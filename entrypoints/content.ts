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
let __quiqsearch_extensionConfig: ExtensionConfig | null
let __quiqsearch_extensionConfig_prev: ExtensionConfig | null
const syncState = (config: ExtensionConfig) => {
	__quiqsearch_extensionConfig_prev = __quiqsearch_extensionConfig
	__quiqsearch_extensionConfig = config
}
const getExtensionConfig = () => {
	if (!__quiqsearch_extensionConfig)
		throw new Error("Extension config is not set.")
	console.debug("getExtensionConfig:", __quiqsearch_extensionConfig)
	return __quiqsearch_extensionConfig
}

const main = () => {
	logger.info("Content Script loaded.")

	let controller = new AbortController()
	const getSignal = () => controller.signal
	const renewController = () => {
		hotkeys.unbind(__quiqsearch_extensionConfig_prev?.manual_shortcutKeys)
		controller = new AbortController()
	}

	const debouncedWithSignalFunctionImpl = () => {
		const config = getExtensionConfig()
		const selection = window.getSelection()?.toString()
		logger.debug("debouncedWithSignalFunction:selection:", selection, config)
		if (!selection) return
		if (selection.length < config.auto_minTextLength) return
		if (selection.length > config.auto_maxTextLength) return
		executeSearch(window.location.href, selection)
	}
	let debouncedWithSignalFunction = debounce(
		debouncedWithSignalFunctionImpl,
		initialAutoDebounceMs,
		{ signal: getSignal() },
	)
	const reRegisterDebounceWithSignalFunction = (debounceMs: number) => {
		debouncedWithSignalFunction = debounce(
			debouncedWithSignalFunctionImpl,
			debounceMs,
			{ signal: getSignal() },
		)
	}
	const eventHandler = () => {
		console.debug("handleSelectionChange:called")
		debouncedWithSignalFunction()
	}

	const init = (event: string, c: AbortController) => {
		const config = getExtensionConfig()
		if (config.mode === "auto") {
			console.log(event, "handleSelectionChange registered.")
			document.removeEventListener("selectionchange", eventHandler)
			renewController()
			reRegisterDebounceWithSignalFunction(config.auto_debounceMs)
			document.addEventListener("selectionchange", eventHandler)
		} else {
			// manual
			console.log(event, "page hotkeys registered.")
			hotkeys(config.manual_shortcutKeys, (event, handler) => {
				const selection = window.getSelection()?.toString()
				if (!selection) return
				console.log(event, "page hotkeys:", event, handler)
				executeSearch(window.location.href, selection)
			})
		}
	}

	const initExtension = () => {
		console.log("aborted", controller.signal.aborted)
		extensionConfigState.storage.getValue().then((config) => {
			syncState(config)
			logger.log(
				"initExtension.__quiqsearch_extensionConfig:",
				__quiqsearch_extensionConfig,
			)
			if (!config.enabled) return
			init("initExtension.storage.getValue", controller)
		})
	}

	const syncExtension = () => {
		console.log("aborted", controller.signal.aborted)
		extensionConfigState.storage.watch((config) => {
			syncState(config)
			logger.info(
				"syncExtension.__quiqsearch_extensionConfig:",
				__quiqsearch_extensionConfig,
			)
			if (!config.enabled) {
				controller.abort()
			} else {
				init("syncExtension.watch", controller)
			}
		})
	}

	initExtension()
	syncExtension()

	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			logger.info("Tab is hidden.")
			controller.abort()
		} else {
			logger.info("Tab is visible.")
			initExtension()
		}
	})
}

export default defineContentScript({
	matches: ["<all_urls>"],
	main,
})
