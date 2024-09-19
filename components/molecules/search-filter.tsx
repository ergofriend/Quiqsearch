import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export const SearchFilter = () => {
	const state = useStorageState(extensionConfigState)
	return (
		<div className="flex flex-col gap-4">
			<div className="select-none">
				<div className="flex items-center space-x-2">
					<Switch
						id="common_filter_enabledExtensions"
						disabled={!state.isInitialized}
						checked={state.current.common_filter_enabledExtensions}
						onCheckedChange={(checked) =>
							state.onChangeState({ common_filter_enabledExtensions: checked })
						}
					/>
					<Label htmlFor="common_filter_enabledExtensions">
						{browser.i18n.getMessage("common_filter_enable_extensions")}
					</Label>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex items-center space-x-2">
					<Checkbox
						id="common_filter_extension_YouTube"
						disabled={
							!state.isInitialized ||
							!state.current.common_filter_enabledExtensions
						}
						checked={state.current.common_filter_extension_YouTube}
						onCheckedChange={(checked) =>
							state.onChangeState({
								common_filter_extension_YouTube: !!checked.valueOf(),
							})
						}
					/>
					<Label htmlFor="common_filter_extension_YouTube">
						{browser.i18n.getMessage("common_filter_enable_youtube")}
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="common_filter_extension_X"
						disabled={
							!state.isInitialized ||
							!state.current.common_filter_enabledExtensions
						}
						checked={state.current.common_filter_extension_X}
						onCheckedChange={(checked) =>
							state.onChangeState({
								common_filter_extension_X: !!checked.valueOf(),
							})
						}
					/>
					<Label htmlFor="common_filter_extension_X">
						{browser.i18n.getMessage("common_filter_enable_x")}
					</Label>
				</div>
			</div>
		</div>
	)
}
