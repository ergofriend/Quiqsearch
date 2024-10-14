import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { debounce } from "es-toolkit"
import hotkeys from "hotkeys-js"
import { toString as event2String, setOptions } from "keyboard-event-to-string"
import { Edit, Save } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { browser } from "wxt/browser"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"

setOptions({ hideKey: "always" })

const debounceCmdRegister = debounce((run: () => void) => {
	run()
}, 250)

export const ModeManualConfig = () => {
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
			<div className="flex gap-2 lg:gap-1 xl:gap-2 items-center">
				<Card className="w-fit">
					<CardContent className="px-4 py-2 text-lg">
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
