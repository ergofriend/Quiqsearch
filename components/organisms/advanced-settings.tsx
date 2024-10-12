import { extensionConfigState } from "@/libs/storage"
import { useStorageState } from "@/libs/useStorageState"
import { AnimatePresence, motion } from "framer-motion"
import { ExtensionSwitch } from "../molecules/extension-switch"
import { IgnoreInputToggle } from "../molecules/ignore-input-toggle"
import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ModeAutoConfig } from "./mode-auto-config"
import { ModeManualConfig } from "./mode-manual-config"

export const AdvancedSettings = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="flex flex-col gap-4 justify-around">
				<Card>
					<CardContent className="pt-6">
						<ExtensionSwitch />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<IgnoreInputToggle />
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<Label>
							この拡張機能はブラウザのデフォルトの検索エンジンを使用します。
							<br />
							検索エンジンを変更するには、詳細設定からカスタムフィルターを追加してください。
						</Label>
					</CardContent>
				</Card>
			</div>

			<ModeConfig />
		</div>
	)
}

const ModeConfig = () => {
	const state = useStorageState(extensionConfigState)

	return (
		<Card>
			<CardContent>
				<Tabs
					value={state.current.mode}
					onValueChange={(value) => {
						if (value !== "auto" && value !== "manual") return
						state.onChangeState({ mode: value })
					}}
					className="flex justify-center lg:justify-start items-center gap-4 flex-col pt-4 lg:flex-row xl:pt-0 flex-wrap"
				>
					<TabsList>
						<TabsTrigger value="auto">
							{browser.i18n.getMessage("auto_mode_label")}
						</TabsTrigger>
						<TabsTrigger value="manual">
							{browser.i18n.getMessage("manual_mode_label")}
						</TabsTrigger>
					</TabsList>
					<AnimatePresence mode="sync">
						<TabsContent key="auto" value="auto" className="h-60 m-0" asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="flex flex-col gap-4 justify-center items-center"
							>
								<ModeAutoConfig />
							</motion.div>
						</TabsContent>
						<TabsContent
							key="manual"
							value="manual"
							className="h-60 m-0"
							asChild
						>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5 }}
								className="flex flex-col justify-center items-center"
							>
								<ModeManualConfig />
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</Tabs>
			</CardContent>
		</Card>
	)
}
