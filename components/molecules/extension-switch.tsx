import { extensionFeatureState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export const ExtensionSwitch = () => {
	const state = useStorageState(extensionFeatureState)
	return (
		<div className="select-none">
			<div className="flex items-center space-x-2">
				<Switch
					id="extension-switch"
					disabled={!state.isInitialized}
					checked={state.current}
					onCheckedChange={(checked) => state.onChangeState(checked)}
				/>
				<Label htmlFor="extension-switch">
					{browser.i18n.getMessage("extension_switch")}
				</Label>
			</div>
		</div>
	)
}
