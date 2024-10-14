import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { browser } from "wxt/browser"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export const ExtensionSwitch = () => {
	const state = useStorageState(extensionConfigState)
	return (
		<div className="select-none">
			<div className="flex items-center space-x-2">
				<Switch
					id="extension-switch"
					disabled={!state.isInitialized}
					checked={state.current.enabled}
					onCheckedChange={(checked) =>
						state.onChangeState({ enabled: checked })
					}
				/>
				<Label htmlFor="extension-switch">
					{browser.i18n.getMessage("extension_switch")}
				</Label>
			</div>
		</div>
	)
}
