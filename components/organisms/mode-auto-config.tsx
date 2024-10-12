import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"

import { InputNumber } from "../molecules/input-number"
import { Label } from "../ui/label"

export const ModeAutoConfig = () => {
	const state = useStorageState(extensionConfigState)

	return (
		<div className="flex flex-col gap-4">
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
					onChange={(value) => state.onChangeState({ auto_debounceMs: value })}
				/>
			</div>
		</div>
	)
}
