import { logger } from "@/libs/logger"
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
type Props =  {
	currentTabUrl: string;
	keyword: string;
	URLSearchParams: URLSearchParams;
}
`)

loader.config({ monaco })

type Props = {
	defaultValue: string
	onCodeChange: (_: { editorCode: string; rawCode: string }) => void
}

export const CustomEditor = (props: Props) => {
	const handleEditorDidMount = useCallback<OnMount>((_editor, _monaco) => {
		const constrainedInstance = constrainedEditor(_monaco)
		const model = _editor.getModel()
		constrainedInstance.initializeIn(_editor)
		constrainedInstance.addRestrictionsTo(model, [
			{
				range: [2, 1, 4, 1],
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
			defaultValue={props.defaultValue}
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
					top: 20,
					bottom: 20,
				},
				folding: false,
				fixedOverflowWidgets: true,
			}}
			onChange={(value) => {
				if (!value) throw new Error("value is undefined")
				const a = monaco.editor.getModels()[0]
				monaco.languages.typescript
					.getTypeScriptWorker()
					.then((worker) => {
						worker(a.uri).then((client) => {
							client.getEmitOutput(a.uri.toString()).then((result) => {
								if (result.outputFiles.length === 0)
									throw new Error("outputFiles is empty")

								const rawCode = result.outputFiles[0].text
								props.onCodeChange({ editorCode: value, rawCode: rawCode })

								logger.debug("editorCode:", value)
								logger.debug("rawCode:", rawCode)
							})
						})
					})
					.catch((e) => {
						logger.error(e)
					})
			}}
		/>
	)
}
