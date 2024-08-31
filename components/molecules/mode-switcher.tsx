import { type WxtStorageItemType, extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

type STORAGE_TYPE = WxtStorageItemType<
	typeof extensionConfigState.storage
>["mode"]

const isStorageType = (value: string): value is STORAGE_TYPE =>
	(["auto", "manual"] as STORAGE_TYPE[]).includes(value as STORAGE_TYPE)

export const ModeSwitcher = () => {
	const state = useStorageState(extensionConfigState)

	const handleOnChange = useCallback(
		(value: string) => {
			if (!isStorageType(value)) {
				throw new Error(`Invalid mode: ${value}`)
			}
			state.onChangeState({ mode: value })
		},
		[state.onChangeState],
	)

	return (
		<RadioGroup
			defaultValue={state.current.mode}
			onValueChange={handleOnChange}
		>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="auto" id="option-one" />
				<Label htmlFor="option-one">自動検索</Label>
			</div>
			<div className="flex items-center space-x-2">
				<RadioGroupItem value="manual" id="option-two" />
				<Label htmlFor="option-two">手動検索</Label>
			</div>
		</RadioGroup>
	)
}
