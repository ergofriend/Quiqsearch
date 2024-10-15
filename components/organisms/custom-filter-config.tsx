import { type Filter, defaultFilter } from "@/libs/filter"
import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { SiX, SiYoutube } from "@icons-pack/react-simple-icons"
import { ChevronDown, ChevronUp, Eye, Plus, Trash2 } from "lucide-react"
import { useCallback } from "react"
import { browser } from "wxt/browser"
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
		<div className="flex flex-col w-full text-primary dark:text-primary-foreground bg-destructive-foreground p-4">
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
		(id: string, update: { siteRegExp?: string; code?: string }) => {
			state.onChangeStateHandler((prev) => ({
				...prev,
				custom_user_filters: prev.custom_user_filters.map((filter) =>
					filter.id === id ? { ...filter, ...update } : filter,
				),
			}))
		},
		[state],
	)

	const addFilter = useCallback(
		(_filter?: Filter) => {
			const newFilter = _filter ?? defaultFilter.getInitialFilter()
			state.onChangeStateHandler((prev) => ({
				...prev,
				custom_user_filters: [...prev.custom_user_filters, newFilter],
			}))
		},
		[state.onChangeStateHandler],
	)

	const removeFilter = useCallback(
		(_filter: Filter) => {
			const confirmed = window.confirm(
				`${_filter.siteRegExp} ${browser.i18n.getMessage("common_delete_custom_filter_confirm")}`,
			)
			if (!confirmed) return
			state.onChangeStateHandler((prev) => ({
				...prev,
				custom_user_filters: prev.custom_user_filters.filter(
					(filter) => filter.id !== _filter.id,
				),
			}))
		},
		[state],
	)

	const handleChangeUserFilter = useCallback(
		(i: number) => (filter: Partial<Filter>) => {
			state.onChangeStateHandler((prev) => ({
				...prev,
				custom_user_filters: prev.custom_user_filters.map((f, index) =>
					index === i ? { ...f, ...filter } : f,
				),
			}))
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
				{!hasFilter(
					state.current.custom_user_filters,
					defaultFilter.getYouTubeFilter(),
				) && (
					<Button
						variant={"outline"}
						onClick={() => addFilter(defaultFilter.getYouTubeFilter())}
					>
						<SiYoutube className="pr-1" />
						{browser.i18n.getMessage("common_add_youtube_custom_filter_button")}
					</Button>
				)}
				{!hasFilter(
					state.current.custom_user_filters,
					defaultFilter.getXFilter(),
				) && (
					<Button
						variant={"outline"}
						onClick={() => addFilter(defaultFilter.getXFilter())}
					>
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
						key={filter.id}
						className="w-full text-primary dark:text-primary-foreground bg-destructive-foreground p-4"
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
											updateFilter(filter.id, { siteRegExp: e.target.value })
										}
										placeholder="new-custom-site.regexp"
									/>

									<Button
										variant={"outline"}
										onClick={() => removeFilter(filter)}
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
									key={filter.id}
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

const hasFilter = (currentFilters: Filter[], filter: Filter) => {
	return currentFilters.some((f) => f.id === filter.id)
}
