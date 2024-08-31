import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { debounce } from "es-toolkit"
import { AnimatePresence, motion } from "framer-motion"
import hotkeys from "hotkeys-js"
import { toString as event2String, setOptions } from "keyboard-event-to-string"
import { Minus, Plus } from "lucide-react"
import { ExtensionSwitch } from "../molecules/extension-switch"
import { AutoModeSwitch, ManualModeSwitch } from "../molecules/mode-switcher"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

setOptions({ hideKey: "always" })

const debounceCmdRegister = debounce((run: () => void) => {
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

	const state = useStorageState(extensionConfigState)

	hotkeys("*", (event) => {
		const newCommand = event2String(event)
		console.debug("hotkeys:*:", newCommand)
		if (isRecording.current) {
			debounceCmdRegister(() => {
				console.log("hotkeys:record:", newCommand)
				state.onChangeState({ shortcutKeys: newCommand })
			})
		}
	})

	return (
		<div className="flex flex-col gap-4">
			<Card className="w-fit">
				<CardContent className="px-4 py-2">
					{state.current.shortcutKeys}
				</CardContent>
			</Card>
			<Button
				type="button"
				className="btn btn-solid-success w-fit"
				onClick={toggleStatus}
			>
				{status === "ready" ? "変更する" : "OK"}
			</Button>
		</div>
	)
}

const InputNumber = (props: {
	value: number
	onChange?: (value: number) => void
}) => {
	return (
		<div className="flex gap-2 w-60 justify-center items-center">
			<Button size={"sm"}>
				<Minus className="h-4 w-4" />
			</Button>
			<Input
				className="input"
				type="number"
				value={props.value}
				onChange={(e) => {
					if (props.onChange) {
						props.onChange(Number(e.target.value))
					}
				}}
			/>
			<Button size={"sm"}>
				<Plus className="h-4 w-4" />
			</Button>
		</div>
	)
}

export const AdvancedSettings = () => {
	const state = useStorageState(extensionConfigState)

	return (
		<div className="flex flex-col gap-3">
			{/* TODO: filter(allow/block) */}
			{/* TODO: invalid targets(input, textarea, etc.) */}
			{/* TODO: internal filters(youtube, twitter, etc.) */}
			{/* TODO: theme(auto/dark/light) */}
			<ExtensionSwitch />

			<Tabs
				value={state.current.mode}
				onValueChange={(value) => {
					if (value !== "auto" && value !== "manual") return
					state.onChangeState({ mode: value })
				}}
			>
				<TabsList>
					<TabsTrigger value="auto">自動検索</TabsTrigger>
					<TabsTrigger value="manual">手動検索</TabsTrigger>
				</TabsList>
				<AnimatePresence mode="sync">
					<TabsContent key="auto" value="auto" className="h-60" asChild>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							<InputNumber value={5} />
							<InputNumber value={15} />
							<InputNumber value={1500} />
						</motion.div>
					</TabsContent>
					<TabsContent key="manual" value="manual" className="h-60" asChild>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						>
							<CommandViewer />
						</motion.div>
					</TabsContent>
				</AnimatePresence>
			</Tabs>
		</div>
	)
}
