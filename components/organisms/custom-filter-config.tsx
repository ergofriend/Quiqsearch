import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { type Filter, filter } from "@/libs/filter"
import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { CustomEditor } from "../molecules/custom-editor"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"

export const CustomFilterConfig = () => {
	const state = useStorageState(extensionConfigState)

	const updateFilter = useCallback(
		(i: number, update: { siteRegExp?: string; code?: string }) => {
			state.onChangeState({
				custom_user_filters: state.current.custom_user_filters.map(
					(filter, index) => (index === i ? { ...filter, ...update } : filter),
				),
			})
		},
		[state],
	)

	const addFilter = useCallback(() => {
		state.onChangeState({
			custom_user_filters: [
				...state.current.custom_user_filters,
				{ ...filter.initial, siteRegExp: "" },
			],
		})
	}, [state])

	const removeFilter = useCallback(
		(i: number) => {
			state.onChangeState({
				custom_user_filters: state.current.custom_user_filters.filter(
					(_, index) => index !== i,
				),
			})
		},
		[state],
	)

	const handleChangeInitialFilter = useCallback(
		(filter: Partial<Filter>) => {
			state.onChangeState({
				custom_fallback_filter: {
					...state.current.custom_fallback_filter,
					...filter,
				},
			})
		},
		[state],
	)

	const handleChangeUserFilter = useCallback(
		(i: number) => (filter: Partial<Filter>) => {
			state.onChangeState({
				custom_user_filters: state.current.custom_user_filters.map(
					(f, index) => (index === i ? { ...f, ...filter } : f),
				),
			})
		},
		[state],
	)

	return (
		<div className="flex gap-8 flex-wrap w-full">
			<Card className="w-full">
				<CardContent className="pt-6 w-full">
					<Accordion
						type="single"
						collapsible
						className="w-full"
						defaultValue="custom_fallback_filter"
					>
						<div className="flex flex-col w-full bg-destructive-foreground p-4">
							<div className="flex gap-2 w-full">
								<Input
									value={state.current.custom_fallback_filter.siteRegExp}
									disabled={true}
								/>
							</div>

							<AccordionItem
								value={"custom_fallback_filter"}
								className="w-full"
							>
								<AccordionTrigger>コードを見る</AccordionTrigger>
								<AccordionContent>
									<CustomEditor
										defaultValue={
											state.current.custom_fallback_filter.editorCode
										}
										onCodeChange={handleChangeInitialFilter}
									/>
								</AccordionContent>
							</AccordionItem>
						</div>

						{state.current.custom_user_filters.map((filter, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={i}
								className="flex flex-col w-full bg-destructive-foreground p-4"
							>
								<div className="flex gap-2 w-full">
									<Input
										value={filter.siteRegExp}
										onChange={(e) =>
											updateFilter(i, { siteRegExp: e.target.value })
										}
										placeholder="new-custom-site.regexp"
									/>
									<Button variant={"outline"} onClick={() => removeFilter(i)}>
										-
									</Button>
								</div>

								<AccordionItem value={`${i}`} className="w-full">
									<AccordionTrigger>コードを見る</AccordionTrigger>
									<AccordionContent>
										<CustomEditor
											defaultValue={filter.editorCode}
											onCodeChange={handleChangeUserFilter(i)}
										/>
									</AccordionContent>
								</AccordionItem>
							</div>
						))}
					</Accordion>

					<Button onClick={addFilter}>追加する</Button>
				</CardContent>
			</Card>
		</div>
	)
}
