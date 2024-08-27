import { ExtensionSwitch } from "../molecules/extension-switch"
import { AutoModeSwitch, ManualModeSwitch } from "../molecules/mode-switcher"

export const AdvancedSettings = () => {
	return (
		<div className="flex flex-col gap-3">
			{/* TODO: filter(allow/block) */}
			{/* TODO: invalid targets(input, textarea, etc.) */}
			{/* TODO: internal filters(youtube, twitter, etc.) */}
			{/* TODO: theme(auto/dark/light) */}
			<ExtensionSwitch />

			<AutoModeSwitch />
			<input className="input" type="number" value={5} />
			<input className="input" type="number" value={15} />
			<input className="input" type="number" value={1500} />

			<ManualModeSwitch />
		</div>
	)
}
