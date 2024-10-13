import { expect, test } from "vitest"
import { evalCode } from "./eval"
import { SkipFilterRequest } from "./filter"

test("raw", async () => {
	const inputCode = `
	({keyword}) => {
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

test("SkipFilterRequest", async () => {
	const inputCode = `
	({keyword}) => {
		if (keyword === "Golang") {
			return "${SkipFilterRequest}"
		}
		return "https://www.google.com/search?q=" +  keyword
	}
	`

	const result = await evalCode({
		currentTabUrl: "",
		keyword: "Golang",
		code: inputCode,
	})
	expect(result).toBe(SkipFilterRequest)
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

test("RegExp(match)", async () => {
	const inputCode = `
	({currentTabUrl, keyword, URLSearchParams}) => {
		const re = new RegExp("github.com\\/([^\\/]+)\\/[^\\/]+");
		const match = currentTabUrl.match(re);
		if (match && match[1]) {
  		const username = match[1];
			URLSearchParams.set("q", "user:" + username + " " + keyword);
		}

		URLSearchParams.set("type", "code");

		return "https://github.com/search?" + URLSearchParams.toString()
	}
	`
	const result = await evalCode({
		currentTabUrl: "https://github.com/ergofriend/Quiqsearch",
		keyword: "Golang",
		code: inputCode,
	})
	expect(result).toBe(
		"https://github.com/search?q=user%3Aergofriend+Golang&type=code",
	)
})
