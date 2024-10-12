import variant from "@jitl/quickjs-singlefile-browser-release-sync"
import { newQuickJSWASMModuleFromVariant } from "quickjs-emscripten-core"
import { Arena } from "quickjs-emscripten-sync"
import whatwgURL from "whatwg-url"
import { logger } from "./logger"

/**
 * @params currentTabUrl string (e.g. "https://github.com/")
 * @params keyword string (e.g. "Golang")
 * @params code (props: {currentTabUrl: string, keyword: string, URLSearchParams: whatwgURL.URLSearchParams}) => string
 */
export const evalCode = async (props: {
	currentTabUrl: string
	keyword: string
	code: string
}) => {
	const QuickJS = await newQuickJSWASMModuleFromVariant(variant)
	const ctx = QuickJS.newContext()
	const arena = new Arena(ctx, { isMarshalable: true })

	// expose objects as global objects in QuickJS context
	const exposed = {
		_currentTabUrl: props.currentTabUrl,
		_keyword: props.keyword,
		_URLSearchParams: new whatwgURL.URLSearchParams(),
	}
	arena.expose(exposed)

	// To execute as an immediate function, delete the last semicolon.
	const code = props.code.replace(/(.*)};/, "}")

	const result = arena.evalCode(
		`(${code})({currentTabUrl: _currentTabUrl, keyword: _keyword, URLSearchParams: _URLSearchParams})`,
	)
	logger.debug("evalCode:", result)

	// Don't forget calling arena.dispose() before disposing QuickJS context!
	arena.dispose()
	ctx.dispose()

	// check if the result is a string
	if (typeof result !== "string") {
		throw new Error("result is not a string")
	}

	return result
}
