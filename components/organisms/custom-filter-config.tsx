import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { type Filter, filterConfig } from "@/libs/filter"
import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { SiX, SiYoutube } from "@icons-pack/react-simple-icons"
import { Plus, Trash2 } from "lucide-react"
import { CustomEditor } from "../molecules/custom-editor"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

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

	const addFilter = useCallback(
		(_filter?: Filter) => {
			const newFilter = _filter ?? { ...filterConfig.initial, siteRegExp: "" }
			state.onChangeState({
				custom_user_filters: [...state.current.custom_user_filters, newFilter],
			})
		},
		[state],
	)

	const removeFilter = useCallback(
		(i: number, _filter: Filter) => {
			const confirmed = window.confirm(
				`${_filter.siteRegExp} のフィルターを削除しますか？`,
			)
			if (!confirmed) return
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
						className="w-full flex flex-col gap-4"
						defaultValue="custom_fallback_filter"
					>
						<div className="flex flex-col w-full bg-destructive-foreground p-4">
							<div className="flex gap-2 w-full">
								<Label>基本のフィルター</Label>
								<p>
									任意のサイトに対して検索することができます。他のフィルターがマッチしなかった場合に使用されます。
								</p>
							</div>

							<AccordionItem
								value={"custom_fallback_filter"}
								className="w-full"
							>
								<AccordionTrigger>
									<Label>コードを見る</Label>
								</AccordionTrigger>
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
									<div className="w-full">
										<Input
											value={filter.siteRegExp}
											onChange={(e) =>
												updateFilter(i, { siteRegExp: e.target.value })
											}
											placeholder="new-custom-site.regexp"
										/>
										<p className="p-2">
											<pre className="inline block whitespace-pre italic pr-2">
												<code>{filter.siteRegExp}</code>
											</pre>
											内での遷移先をコントロールすることができます。
										</p>
									</div>

									<Button
										variant={"outline"}
										onClick={() => removeFilter(i, filter)}
									>
										<Trash2 size={20} color="red" />
									</Button>
								</div>

								<AccordionItem value={`${i}`} className="w-full">
									<AccordionTrigger>
										<Label>コードを見る</Label>
									</AccordionTrigger>
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

					<div className="flex justify-end pt-4 gap-4 items-center flex-wrap">
						{ifNoFilter(state.current.custom_user_filters, "youtube.com") && (
							<Button
								variant={"outline"}
								onClick={() => addFilter(filterConfig.YouTube)}
							>
								<SiYoutube className="pr-1" />
								のフィルターを追加する
							</Button>
						)}
						{ifNoFilter(state.current.custom_user_filters, "x.com") && (
							<Button
								variant={"outline"}
								onClick={() => addFilter(filterConfig.X)}
							>
								<SiX size={15} />
								のフィルターを追加する
							</Button>
						)}
						<Button onClick={() => addFilter()}>
							<Plus />
							新しいフィルターを追加する
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

const ifNoFilter = (currentFilters: Filter[], site: string) => {
	if (currentFilters.length === 0) return true
	return !currentFilters.some((filter) =>
		new RegExp(filter.siteRegExp).test(site),
	)
}
