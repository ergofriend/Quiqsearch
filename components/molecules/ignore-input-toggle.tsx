import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { browser } from "wxt/browser"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export const IgnoreInputToggle = () => {
	const state = useStorageState(extensionConfigState)
	return (
		<div className="select-none">
			<div className="flex items-center space-x-2">
				<Switch
					id="ignore-input-toggle"
					disabled={!state.isInitialized}
					checked={state.current.common_ignoreInput}
					onCheckedChange={(checked) =>
						state.onChangeState({ common_ignoreInput: checked })
					}
				/>
				<Label htmlFor="ignore-input-toggle">
					{browser.i18n.getMessage("common_ignore_input")}
				</Label>
			</div>
		</div>
	)
}
