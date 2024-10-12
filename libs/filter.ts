export type Filter = {
	/** Site regular expression */
	siteRegExp: string
	/** TypeScript code */
	editorCode: string
	/** JavaScript code */
	rawCode: string
}

const initial = {
	siteRegExp: "*",
	editorCode: `({currentTabUrl, keyword, URLSearchParams}: Props) => {
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
}`,
	rawCode: `({currentTabUrl, keyword, URLSearchParams}) => {
	URLSearchParams.set("q", keyword)
	return "https://www.google.com/search?" + URLSearchParams.toString()
}`,
} satisfies Filter

const YouTube = {
	siteRegExp: "youtube.com",
	editorCode: `({currentTabUrl, keyword, URLSearchParams}: Props) => {
	URLSearchParams.set("search_query", keyword)
	return "https://www.youtube.com/results?" + URLSearchParams.toString()
}`,
	rawCode: `({currentTabUrl, keyword, URLSearchParams}) => {
  URLSearchParams.set("search_query", keyword)
  return "https://www.youtube.com/results?" + URLSearchParams.toString()
}`,
} satisfies Filter

const X = {
	siteRegExp: "x.com",
	editorCode: `({currentTabUrl, keyword, URLSearchParams}: Props) => {
	URLSearchParams.set("q", keyword)
	return "https://x.com/search?" + URLSearchParams.toString()
}`,
	rawCode: `({currentTabUrl, keyword, URLSearchParams}) => {
  URLSearchParams.set("q", keyword)
  return "https://x.com/search?" + URLSearchParams.toString()
}`,
}

export const filter = {
	initial,
	YouTube,
	X,
}
