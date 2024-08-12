import { useStorageState } from "@/libs/useStorageState"

const types = ["manual", "auto"] as const
type STORAGE_TYPE = (typeof types)[number]

const isStorageType = (value: string): value is STORAGE_TYPE =>
	types.includes(value as STORAGE_TYPE)

const BaseSwitch = (props: { mode: string; disabled?: boolean }) => {
	const state = useStorageState<STORAGE_TYPE>("sync:mode", "manual")

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
