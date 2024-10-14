import { FilterType, PreviewFilterCode } from "@/libs/filter"
import { logger } from "@/libs/logger"
import Editor, { loader, type OnMount } from "@monaco-editor/react"

import { constrainedEditor } from "constrained-editor-plugin"
import { Expand, Minimize } from "lucide-react"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { useCallback, useRef, useState } from "react"

self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "typescript" || label === "javascript") {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

monaco.languages.typescript.typescriptDefaults.addExtraLib(FilterType)

loader.config({ monaco })

type CustomEditorProps = {
	defaultValue: string
	onCodeChange: (_: { editorCode: string; rawCode: string }) => void
}

export const CustomEditor = (props: CustomEditorProps) => {
	const lineCount = props.defaultValue.split("\n").length

	const [isExpanded, setIsExpanded] = useState(false)
	const handleEditorSizeToggle = useCallback(
		() => setIsExpanded((prev) => !prev),
		[],
	)

	return (
		<div className="relative">
			<CoreEditor
				{...props}
				height={isExpanded ? "300px" : "130px"}
				restriction={{
					range: [2, 1, Math.max(2, lineCount), 1],
					allowMultiline: true,
				}}
			/>
			<div className="absolute top-4 right-4 bg-transparent">
				{isExpanded ? (
					<Minimize color="white" onClick={handleEditorSizeToggle} />
				) : (
					<Expand color="white" onClick={handleEditorSizeToggle} />
				)}
			</div>
		</div>
	)
}

export const PreviewEditor = () => {
	return (
		<CoreEditor
			defaultValue={PreviewFilterCode}
			height="210px"
			restriction={{ range: [2, 1, 7, 1] }}
		/>
	)
}

type CoreEditorProps = {
	defaultValue?: string
	onCodeChange?: (_: { editorCode: string; rawCode: string }) => void
	restriction: Restriction
	height: `${string}px`
}

type Restriction = {
	range: [number, number, number, number]
	allowMultiline?: boolean
}

const CoreEditor = (props: CoreEditorProps) => {
	const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
	const handleEditorDidMount = useCallback<OnMount>(
		(_editor, _monaco) => {
			editor.current = _editor
			const constrainedInstance = constrainedEditor(_monaco)
			const model = _editor.getModel()
			constrainedInstance.initializeIn(_editor)
			constrainedInstance.addRestrictionsTo(model, [props.restriction])
		},
		[props.restriction],
	)

	return (
		<Editor
			onMount={handleEditorDidMount}
			height={props.height}
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
				if (!editor.current) throw new Error("monacoInstance is undefined")

				if (!value) throw new Error("value is undefined")

				const model = editor.current.getModel()
				if (!model) throw new Error("model is undefined")

				monaco.languages.typescript
					.getTypeScriptWorker()
					.then((worker) => {
						worker(model.uri).then((client) => {
							client.getEmitOutput(model.uri.toString()).then((result) => {
								if (result.outputFiles.length === 0)
									throw new Error("outputFiles is empty")

								const rawCode = result.outputFiles[0].text
								if (props.onCodeChange) {
									props.onCodeChange({ editorCode: value, rawCode: rawCode })
									logger.debug("editorCode:", value)
									logger.debug("rawCode:", rawCode)
								} else {
									logger.debug("onCodeChange is undefined")
								}
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
