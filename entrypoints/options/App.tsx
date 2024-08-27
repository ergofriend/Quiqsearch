import "../../assets/tailwind.css" // XXX: no alias import
import { DotBackground } from "@/components/molecules/background"
import { AdvancedSettings } from "@/components/organisms/advanced-settings"
import { debounce } from "es-toolkit"

import hotkeys from "hotkeys-js"
import { toString as event2String, setOptions } from "keyboard-event-to-string"

setOptions({ hideKey: "always" })

const debounceCmdRegister = debounce((run: () => void) => {
	run()
}, 250)

const debounceCmdExec = debounce((run: () => void) => {
	run()
}, 250)

const CommandViewer = () => {
	const [status, setStatus] = useState<"ready" | "recording">("ready")
	const toggleStatus = () =>
		setStatus((prev) => (prev === "ready" ? "recording" : "ready"))

	const isRecording = useRef(false)
	useEffect(() => {
		if (status === "recording") {
			isRecording.current = true
		} else {
			isRecording.current = false
		}
	}, [status])

	const [command, setCommand] = useState("-")

	hotkeys("*", (event) => {
		const newCommand = event2String(event)
		console.debug("hotkeys:*:", newCommand)
		if (isRecording.current) {
			debounceCmdRegister(() => {
				console.log("hotkeys:record:", newCommand)
				setCommand((oldCommand) => {
					hotkeys.unbind(oldCommand)
					hotkeys(newCommand, () => {
						debounceCmdExec(() => {
							console.info("hotkeys:command:", newCommand)
						})
					})
					return newCommand
				})
			})
		}
	})

	return (
		<div className="flex flex-col gap-4">
			{status}
			<input
				type="text"
				className="input input-bordered"
				disabled
				value={command}
			/>
			<button
				type="button"
				className="btn btn-solid-success"
				onClick={toggleStatus}
			>
				{status === "ready" ? "変更する" : "OK"}
			</button>
		</div>
	)
}

function App() {
	return (
		<DotBackground>
			<div className="flex flex-col gap-8 px-20">
				<div className="pt-8 border-b border-gray-200 pb-8">
					<div className="mx-0 max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900">
							{browser.i18n.getMessage("app_title")}
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600">
							{browser.i18n.getMessage("app_description")}
						</p>
					</div>
				</div>

				<div className="">
					<h2 className="text-lg font-semibold leading-6 text-gray-900">
						{browser.i18n.getMessage("detail_settings")}
					</h2>
					<AdvancedSettings />
					<CommandViewer />
				</div>

				<div className="">
					<h2 className="text-lg font-semibold leading-6 text-gray-900">
						Links
					</h2>

					<span className="flex items-center gap-2">
						<span className="dot dot-primary" />
						<span>Ready</span>
					</span>
					<span className="flex items-center gap-2">
						<span className="dot dot-error" />
						<a
							className="link link-underline"
							href="https://github.com/ergofriend/Quiqsearch"
						>
							テストページ（GitHub）
						</a>
					</span>
					<span className="flex items-center gap-2">
						<span className="dot dot-secondary" />
						<span>Waiting</span>
					</span>
					<span className="flex items-center gap-2">
						<span className="dot dot-success" />
						<span>Success</span>
					</span>
				</div>
			</div>
		</DotBackground>
	)
}

export default App
