import { ExtensionSwitch } from "@/components/molecules/extension-switch"
import {
	AutoModeSwitch,
	ManualModeSwitch,
} from "@/components/molecules/mode-switcher"

export const BasicSettings = () => {
	return (
		<div>
			{/* TODO: GitHub repo link */}
			<ExtensionSwitch />
			<div className="flex flex-col gap-3">
				<AutoModeSwitch />
				<ManualModeSwitch />
			</div>
		</div>
	)
}
