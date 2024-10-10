declare module "constrained-editor-plugin" {
	export const constrainedEditor = (
		_: typeof monaco,
	): {
		initializeIn: (editor: editor.IStandaloneCodeEditor) => void
		addRestrictionsTo: (
			model: monaco.editor.ITextModel | null,
			restrictions: {
				range: [number, number, number, number]
				allowMultiline?: boolean
			}[],
		) => void
	} => {}
}
