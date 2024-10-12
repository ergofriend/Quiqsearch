import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { debounce } from "es-toolkit"
import { AnimatePresence, motion } from "framer-motion"
import hotkeys from "hotkeys-js"
import { toString as event2String, setOptions } from "keyboard-event-to-string"
import { Edit, Minus, Plus, Save } from "lucide-react"
import { ExtensionSwitch } from "../molecules/extension-switch"
import { IgnoreInputToggle } from "../molecules/ignore-input-toggle"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
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
				state.onChangeState({ manual_shortcutKeys: newCommand })
			})
		}
	})

	return (
		<div className="grid gap-2">
			<Label className="text-sm font-semibold">
				{browser.i18n.getMessage("manual_command_label")}
			</Label>
			<div className="flex gap-4 items-center">
				<Card className="w-fit">
					<CardContent className="px-4 py-2 text-2xl">
						{state.current.manual_shortcutKeys}
					</CardContent>
				</Card>
				<Button
					type="button"
					className="btn btn-solid-success w-fit"
					onClick={toggleStatus}
				>
					{status === "ready" ? (
						<Edit className="h-4 w-4" />
					) : (
						<Save className="h-4 w-4" />
					)}
				</Button>
			</div>
		</div>
	)
}

const InputNumber = (props: {
	value: number
	onChange?: (value: number) => void
}) => {
	const handleIncrement = () => {
		if (props.onChange) {
			props.onChange(props.value + 1)
		}
	}
	const handleDecrement = () => {
		if (props.onChange) {
			props.onChange(props.value - 1)
		}
	}
	return (
		<div className="flex gap-2 w-60 justify-center items-center">
			<Button size={"sm"} onClick={handleDecrement} disabled={props.value <= 0}>
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
			<Button
				size={"sm"}
				onClick={handleIncrement}
				disabled={props.value >= 9999}
			>
				<Plus className="h-4 w-4" />
			</Button>
		</div>
	)
}

export const AdvancedSettings = () => {
	return (
		<div className="flex gap-8 flex-wrap w-full">
			<LeftPanel />
			<RightPanel />
		</div>
	)
}

const LeftPanel = () => {
	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="pt-6">
					<ExtensionSwitch />
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<IgnoreInputToggle />
				</CardContent>
			</Card>
		</div>
	)
}

const RightPanel = () => {
	const state = useStorageState(extensionConfigState)

	return (
		<Card>
			<CardContent className="pt-6">
				<Tabs
					value={state.current.mode}
					onValueChange={(value) => {
						if (value !== "auto" && value !== "manual") return
						state.onChangeState({ mode: value })
					}}
				>
					<TabsList>
						<TabsTrigger value="auto">
							{browser.i18n.getMessage("auto_mode_label")}
						</TabsTrigger>
						<TabsTrigger value="manual">
							{browser.i18n.getMessage("manual_mode_label")}
						</TabsTrigger>
					</TabsList>
					<AnimatePresence mode="sync">
						<TabsContent key="auto" value="auto" className="h-60" asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="flex flex-col gap-4 pt-4"
							>
								<div className="grid">
									<Label className="text-sm font-semibold">
										{browser.i18n.getMessage("auto_mode_min_length")}
									</Label>
									<InputNumber
										value={state.current.auto_minTextLength}
										onChange={(value) =>
											state.onChangeState({ auto_minTextLength: value })
										}
									/>
								</div>
								<div className="grid">
									<Label className="text-sm font-semibold">
										{browser.i18n.getMessage("auto_mode_max_length")}
									</Label>
									<InputNumber
										value={state.current.auto_maxTextLength}
										onChange={(value) =>
											state.onChangeState({ auto_maxTextLength: value })
										}
									/>
								</div>
								<div className="grid">
									<Label className="text-sm font-semibold">
										{`${browser.i18n.getMessage("auto_mode_interval")} (ms)`}
									</Label>
									<InputNumber
										value={state.current.auto_debounceMs}
										onChange={(value) =>
											state.onChangeState({ auto_debounceMs: value })
										}
									/>
								</div>
							</motion.div>
						</TabsContent>
						<TabsContent key="manual" value="manual" className="h-60" asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="pt-4"
							>
								<CommandViewer />
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</Tabs>
			</CardContent>
		</Card>
	)
}
