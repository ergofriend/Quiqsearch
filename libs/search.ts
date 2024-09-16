const searchWithGoogle = (keyword: string) => {
	const url = new URL("https://www.google.com/search")
	url.searchParams.set("q", keyword)
	return url.toString()
}

export const executeSearch = (currentTabUrl: string, selectedText: string) => {
	if (!selectedText) return

	const target = searchWithGoogle(selectedText)
	if (typeof window !== "undefined") {
		window.open(target, "_blank")
	} else {
		browser.tabs.create({ url: target })
	}
	console.info("executeSearch:", currentTabUrl, selectedText, target)
}
