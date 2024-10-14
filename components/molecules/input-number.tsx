import { Minus, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const InputNumber = (props: {
	value: number
	onChange?: (value: number) => void
}) => {
	const handleIncrement = () => {
		if (props.onChange) {
			props.onChange(props.value + 1)
		}
	}
	const handleDecrement = () => {
		if (props.onChange) {
			props.onChange(props.value - 1)
		}
	}
	return (
		<div className="flex gap-2 w-36 justify-center items-center">
			<Button size={"sm"} onClick={handleDecrement} disabled={props.value <= 0}>
				<Minus className="h-4 w-4" />
			</Button>
			<Input
				className="input w-16"
				type="number"
				value={props.value}
				onChange={(e) => {
					if (props.onChange) {
						props.onChange(Number(e.target.value))
					}
				}}
			/>
			<Button
				size={"sm"}
				onClick={handleIncrement}
				disabled={props.value >= 9999}
			>
				<Plus className="h-4 w-4" />
			</Button>
		</div>
	)
}
