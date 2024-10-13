import { nanoid } from "nanoid"

export type Filter = {
	id: string
} & FilterCore

type FilterCore = {
	/** Site regular expression */
	siteRegExp: string
	/** TypeScript code */
	editorCode: string
	/** JavaScript code */
	rawCode: string
}

export const SkipFilterRequest = "SKIP_FILTER_REQUEST"

export const FilterType = `
type Props =  {
	currentTabUrl: string;
	keyword: string;
	URLSearchParams: URLSearchParams;
}
const SkipFilterRequest = "${SkipFilterRequest}"
`

const editorTemplateCode = (code: string) =>
	`({currentTabUrl, keyword, URLSearchParams}: Props): string => {${code}}`

const editorRawCode = (code: string) =>
	`({currentTabUrl, keyword, URLSearchParams}) => {${code}}`

export const PreviewFilterCode = editorTemplateCode(`
	if (keyword === "Skip me.") {
		// You can skip to the next filter by returning SkipFilterRequest
		return SkipFilterRequest
	}
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
`)

const initial = {
	siteRegExp: "*",
	editorCode: editorTemplateCode(`
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
`),
	rawCode: editorRawCode(`
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
`),
} satisfies FilterCore

const YouTube = {
	siteRegExp: "youtube.com",
	editorCode: editorTemplateCode(`
	URLSearchParams.set("search_query", keyword)
	return "https://www.youtube.com/results?" + URLSearchParams.toString()
`),
	rawCode: editorRawCode(`
  URLSearchParams.set("search_query", keyword)
  return "https://www.youtube.com/results?" + URLSearchParams.toString()
`),
} satisfies FilterCore

const X = {
	siteRegExp: "x.com",
	editorCode: editorTemplateCode(`
	URLSearchParams.set("q", keyword)
	return "https://x.com/search?" + URLSearchParams.toString()
`),
	rawCode: editorRawCode(`
  URLSearchParams.set("q", keyword)
  return "https://x.com/search?" + URLSearchParams.toString()
`),
} satisfies FilterCore

export const defaultFilter = {
	getInitialFilter: () => ({ ...initial, id: nanoid() }),
	getYouTubeFilter: () => ({ ...YouTube, id: "official-youtube-filter" }),
	getXFilter: () => ({ ...X, id: "official-x-filter" }),
}
