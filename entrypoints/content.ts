import { logger } from "@/libs/logger"
import { executeSearch } from "@/libs/search"
import {
	extensionFeatureState,
	extensionModeState,
	extensionShortcutState,
} from "@/libs/storage"
import { debounce } from "es-toolkit"
import hotkeys from "hotkeys-js"

const handleSelectionChange = (event: string, c: AbortController) => {
	const debounceMs = 2000
	const debouncedWithSignalFunction = debounce(
		(text: string) => {
			extensionModeState.storage.getValue().then((mode) => {
				if (mode !== "auto") return
				executeSearch(window.location.href, text)
			})
		},
		debounceMs,
		{ signal: c.signal },
	)

	return () => {
		const selection = window.getSelection()?.toString()
		logger.debug(event, "handleSelectionChange:", selection)
		if (!selection) return
		debouncedWithSignalFunction(selection)
		browser.runtime.sendMessage(selection)
	}
}

let clearHotkeys = ""

const init = (event: string, c: AbortController) => {
	extensionModeState.storage.getValue().then((mode) => {
		if (mode === "auto") {
			console.log(event, "handleSelectionChange registered.")
			document.removeEventListener(
				"selectionchange",
				handleSelectionChange(event, c),
			)
			document.addEventListener(
				"selectionchange",
				handleSelectionChange(event, c),
			)
		} else {
			// manual
			extensionShortcutState.storage.getValue().then((shortcut) => {
				console.log(event, "page hotkeys registered.")
				clearHotkeys = shortcut
				hotkeys(shortcut, (event, handler) => {
					const selection = window.getSelection()?.toString()
					if (!selection) return
					console.log(event, "page hotkeys:", event, handler)
					executeSearch(window.location.href, selection)
				})
			})
		}
	})
}

const main = () => {
	logger.info("Content Script loaded.")

	let controller = new AbortController()
	const renewController = () => {
		hotkeys.unbind(clearHotkeys)
		controller = new AbortController()
	}

	const initExtension = () => {
		extensionFeatureState.storage.getValue().then((isExtensionEnabled) => {
			logger.log("initExtension.isExtensionEnabled:", isExtensionEnabled)
			if (!isExtensionEnabled) return
			renewController()
			init("initExtension.storage.getValue", controller)
		})
	}

	const syncExtension = () => {
		extensionFeatureState.storage.watch((isExtensionEnabled) => {
			logger.info("syncExtension.isExtensionEnabled:", isExtensionEnabled)
			if (!isExtensionEnabled) {
				controller.abort()
			} else {
				renewController()
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
