import Editor, { loader, type OnMount } from "@monaco-editor/react"

import { constrainedEditor } from "constrained-editor-plugin"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "typescript" || label === "javascript") {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

monaco.languages.typescript.typescriptDefaults.addExtraLib(`
  "file:///node_modules/@types/whatwg-url/index.d.ts"
  type Props =  {
    currentTabUrl: string;
    keyword: string;
    URLSearchParams: URLSearchParams;
  }
  `)

loader.config({ monaco })

const defaultValue = `(props: Props): string => {
  const { URLSearchParams, keyword } = props
  URLSearchParams.set("q", keyword)
  return "https://www.google.com/search?" + URLSearchParams.toString()
}`

export const CustomEditor = () => {
	const handleEditorDidMount = useCallback<OnMount>((editor, monaco) => {
		const constrainedInstance = constrainedEditor(monaco)
		const model = editor.getModel()
		constrainedInstance.initializeIn(editor)
		constrainedInstance.addRestrictionsTo(model, [
			{
				range: [2, 1, 5, 1],
				allowMultiline: true,
			},
		])
	}, [])

	return (
		<Editor
			onMount={handleEditorDidMount}
			height="130px"
			theme="vs-dark"
			defaultLanguage="typescript"
			defaultValue={defaultValue}
			options={{
				minimap: { enabled: false },
				overviewRulerBorder: false,
				overviewRulerLanes: 0,
				hideCursorInOverviewRuler: true,
				stickyScroll: {
					enabled: false,
				},
				scrollBeyondLastLine: false,
				fontSize: 14,
				padding: {
					top: 10,
					bottom: 10,
				},
				folding: false,
			}}
			onChange={(value) => {
				console.log(value)
				const a = monaco.editor.getModels()[0]
				console.log(a.getValue())
				monaco.languages.typescript.getTypeScriptWorker().then((worker) => {
					worker(a.uri).then((client) => {
						client.getEmitOutput(a.uri.toString()).then((result) => {
							console.log(result.outputFiles[0].text)
						})
					})
				})
			}}
		/>
	)
}
