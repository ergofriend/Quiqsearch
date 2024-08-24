import { logger } from "@/libs/logger"
import { extensionFeatureState } from "@/libs/storage"
import { debounce } from "es-toolkit"

const searchWithGoogle = (keyword: string) => {
	const url = new URL("https://www.google.com/search")
	url.searchParams.set("q", keyword)
	window.open(url.toString(), "_blank")
	console.info("searchWithGoogle:", keyword)
}

const handleSelectionChange = (event: string, c: AbortController) => {
	const debounceMs = 2000
	const debouncedWithSignalFunction = debounce(
		(text: string) => {
			searchWithGoogle(text)
		},
		debounceMs,
		{ signal: c.signal },
	)

	return () => {
		const selection = window.getSelection()?.toString()
		logger.debug(event, "handleSelectionChange:", selection)
		if (!selection) return
		debouncedWithSignalFunction(selection)
	}
}

const init = (event: string, c: AbortController) => {
	console.log(event, "handleSelectionChange registered.")
	document.removeEventListener(
		"selectionchange",
		handleSelectionChange(event, c),
	)
	document.addEventListener("selectionchange", handleSelectionChange(event, c))
}

const main = () => {
	logger.info("Content Script loaded.")

	let controller = new AbortController()
	const renewController = () => {
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
