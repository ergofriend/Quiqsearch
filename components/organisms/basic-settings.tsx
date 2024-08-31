import { ExtensionSwitch } from "@/components/molecules/extension-switch"
import { ModeSwitcher } from "@/components/molecules/mode-switcher"

export const BasicSettings = () => {
	return (
		<div className="flex flex-col gap-4">
			<ExtensionSwitch />
			<ModeSwitcher />
		</div>
	)
}
