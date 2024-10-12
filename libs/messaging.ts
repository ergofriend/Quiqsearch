import { defineExtensionMessaging } from "@webext-core/messaging"

type ExactSearch = {
	type: "exact"
	url: string
}

type AutoSearch = {
	type: "auto"
	keyword: string
}

type SearchConfig = ExactSearch | AutoSearch

type SearchMessaging = {
	searchOnTab: (_: SearchConfig) => void
}

export const searchMessaging = defineExtensionMessaging<SearchMessaging>()
