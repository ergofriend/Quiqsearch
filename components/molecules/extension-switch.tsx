import { extensionFeatureState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"

export const ExtensionSwitch = () => {
	const state = useStorageState(extensionFeatureState)
	return (
		<div className="select-none">
			<label htmlFor="extension-switch">
				{browser.i18n.getMessage("extension_switch")}
				<input
					id="extension-switch"
					type="checkbox"
					className="switch switch-primary"
					disabled={!state.isInitialized}
					checked={state.current}
					onChange={(e) => state.onChangeState(e.target.checked)}
				/>
			</label>
		</div>
	)
}
