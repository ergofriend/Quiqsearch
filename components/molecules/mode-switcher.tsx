import { type WxtStorageItemType, extensionModeState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"

type STORAGE_TYPE = WxtStorageItemType<typeof extensionModeState.storage>

const isStorageType = (value: string): value is STORAGE_TYPE =>
	(["auto", "manual"] as STORAGE_TYPE[]).includes(value as STORAGE_TYPE)

const BaseSwitch = (props: { mode: string; disabled?: boolean }) => {
	const state = useStorageState(extensionModeState)

	const handleOnChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!isStorageType(e.target.value)) {
				throw new Error(`Invalid mode: ${e.target.value}`)
			}
			state.onChangeState(e.target.value)
		},
		[state.onChangeState],
	)

	return (
		<label className="inline-flex" htmlFor={props.mode}>
			<input
				type="radio"
				className="radio"
				name="mode-switch"
				id={props.mode}
				value={props.mode}
				checked={state.isInitialized && state.current === props.mode}
				disabled={props.disabled}
				onChange={handleOnChange}
			/>
			{props.mode}
		</label>
	)
}

export const ManualModeSwitch = () => {
	return <BaseSwitch mode="manual" />
}

export const AutoModeSwitch = () => {
	return <BaseSwitch mode="auto" />
}
