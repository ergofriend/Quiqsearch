import { type Filter, filterConfig } from "@/libs/filter"
import { logger } from "@/libs/logger"
import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { SiX, SiYoutube } from "@icons-pack/react-simple-icons"
import { ChevronDown, ChevronUp, Eye, Plus, Trash2 } from "lucide-react"
import { CustomEditor, PreviewEditor } from "../molecules/custom-editor"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const CustomFilterConfig = () => {
	return (
		<div className="flex gap-8 flex-wrap w-full">
			<Card className="w-full">
				<CardContent className="pt-6 w-full">
					<PreviewFilterConfig />
					<UserFilterConfig />
				</CardContent>
			</Card>
		</div>
	)
}

const PreviewFilterConfig = () => {
	return (
		<div className="flex flex-col w-full bg-destructive-foreground p-4">
			<div className="flex gap-2 w-full pb-2">
				<Label>
					{browser.i18n.getMessage("common_sample_custom_filter_1")}
				</Label>
				<p>{browser.i18n.getMessage("common_sample_custom_filter_2")}</p>
			</div>
			<div className="relative">
				<Eye className="absolute top-4 right-4 z-10" color="white" />
				<PreviewEditor />
			</div>
		</div>
	)
}

const UserFilterConfig = () => {
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
			const newFilter = _filter ?? filterConfig.initial
			state.onChangeState({
				custom_user_filters: [...state.current.custom_user_filters, newFilter],
			})
		},
		[state],
	)

	const removeFilter = useCallback(
		(i: number, _filter: Filter) => {
			const confirmed = window.confirm(
				`${_filter.siteRegExp} ${browser.i18n.getMessage("common_delete_custom_filter_confirm")}`,
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

	const handleReorderUserFilter = useCallback(
		(from: number, to: number) => {
			const filters = [...state.current.custom_user_filters]
			const [removed] = filters.splice(from, 1)
			filters.splice(to, 0, removed)
			state.onChangeState({ custom_user_filters: filters })
		},
		[state],
	)

	return (
		<>
			<div className="flex justify-end p-4 gap-4 items-center flex-wrap">
				{ifNoFilter(state.current.custom_user_filters, "youtube.com") && (
					<Button
						variant={"outline"}
						onClick={() => addFilter(filterConfig.YouTube)}
					>
						<SiYoutube className="pr-1" />
						{browser.i18n.getMessage("common_add_youtube_custom_filter_button")}
					</Button>
				)}
				{ifNoFilter(state.current.custom_user_filters, "x.com") && (
					<Button variant={"outline"} onClick={() => addFilter(filterConfig.X)}>
						<SiX size={15} className="pr-1" />
						{browser.i18n.getMessage("common_add_x_custom_filter_button")}
					</Button>
				)}
				<Button onClick={() => addFilter()}>
					<Plus />
					{browser.i18n.getMessage("common_add_new_custom_filter_button")}
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				{state.current.custom_user_filters.map((filter, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="w-full bg-destructive-foreground p-4"
					>
						<div className="flex gap-2">
							<div className="flex flex-col gap-2 justify-center">
								<Button
									size={"sm"}
									disabled={i === 0}
									onClick={() => handleReorderUserFilter(i, i - 1)}
								>
									<ChevronUp />
								</Button>
								<Button
									size={"sm"}
									disabled={i === state.current.custom_user_filters.length - 1}
									onClick={() => handleReorderUserFilter(i, i + 1)}
								>
									<ChevronDown />
								</Button>
							</div>
							<div className="flex flex-col w-full">
								<div className="flex gap-2 w-full">
									<Input
										value={filter.siteRegExp}
										onChange={(e) =>
											updateFilter(i, { siteRegExp: e.target.value })
										}
										placeholder="new-custom-site.regexp"
									/>

									<Button
										variant={"outline"}
										onClick={() => removeFilter(i, filter)}
									>
										<Trash2 size={20} color="red" />
									</Button>
								</div>

								<div className="p-2">
									<pre className="inline block whitespace-pre italic bg-gray-200 px-1 rounded">
										<code>{filter.siteRegExp}</code>
									</pre>
									<span className="pl-1">
										{browser.i18n.getMessage(
											"common_about_custom_filters_regexp_1",
										)}
									</span>
									（
									<pre className="inline block whitespace-pre italic bg-gray-200 px-1 rounded">
										<code>*</code>
									</pre>
									<span className="pl-1">
										{browser.i18n.getMessage(
											"common_about_custom_filters_regexp_2",
										)}
									</span>
									）
								</div>

								<CustomEditor
									defaultValue={filter.editorCode}
									onCodeChange={handleChangeUserFilter(i)}
								/>
							</div>
						</div>
					</div>
				))}

				{state.current.custom_user_filters.length === 0 ? (
					<div className="flex justify-center p-4">
						<p>{browser.i18n.getMessage("common_no_custom_filters")}</p>
					</div>
				) : (
					<div className="flex justify-center p-4">
						<p>{browser.i18n.getMessage("common_has_custom_filters")}</p>
					</div>
				)}
			</div>
		</>
	)
}

const ifNoFilter = (currentFilters: Filter[], site: string) => {
	if (currentFilters.length === 0) return true

	try {
		return !currentFilters.some(
			(filter) =>
				filter.siteRegExp !== "" &&
				filter.siteRegExp !== "*" &&
				new RegExp(filter.siteRegExp).test(site),
		)
	} catch (error) {
		logger.error(error)
	}

	return false
}
