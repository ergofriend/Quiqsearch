import { expect, test } from "vitest"
import { evalCode } from "./eval"

test("raw", async () => {
	const inputCode = `
	({target, keyword}) => {
		return "https://www.google.com/search?q=" +  keyword
	}
	`
	const result = await evalCode({
		currentTabUrl: "",
		keyword: "Golang",
		code: inputCode,
	})
	expect(result).toBe("https://www.google.com/search?q=Golang")
})

test("URLSearchParams", async () => {
	const inputCode = `
	({currentTabUrl, keyword, URLSearchParams}) => {
		URLSearchParams.set("q", keyword)
		return "https://www.google.com/search?" + URLSearchParams.toString()
	}
	`
	const result = await evalCode({
		currentTabUrl: "",
		keyword: `Golang "templ"`,
		code: inputCode,
	})
	expect(result).toBe("https://www.google.com/search?q=Golang+%22templ%22")
})

test("RegExp(test)", async () => {
	const inputCode = `
	({currentTabUrl, keyword, URLSearchParams}) => {
		URLSearchParams.set("q", keyword)
		const isFromGithub = new RegExp("github.com").test(currentTabUrl)
		if (isFromGithub) {
			URLSearchParams.set("ref", "github.com")
		}
		return "https://www.google.com/search?" + URLSearchParams.toString()
	}
	`
	const result = await evalCode({
		currentTabUrl: "https://github.com/",
		keyword: "Golang",
		code: inputCode,
	})
	expect(result).toBe("https://www.google.com/search?q=Golang&ref=github.com")
})
