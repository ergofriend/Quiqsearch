import { DotBackground } from "@/components/molecules/background"
import { AdvancedSettings } from "@/components/organisms/advanced-settings"
import { Card, CardContent } from "@/components/ui/card"
import { Cover } from "@/components/ui/cover"

function App() {
	return (
		<DotBackground>
			<div className="w-full overflow-auto flex flex-col gap-8 px-20 py-10">
				<h1 className="text-4xl font-bold tracking-tight text-gray-900">
					{browser.i18n.getMessage("app_title")}
				</h1>

				<h2
					style={{ lineHeight: 1.5 }}
					className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
				>
					ページの<Cover>選択範囲</Cover>を素早く検索
				</h2>

				<div className="">
					<h2 className="text-lg font-semibold leading-6 text-gray-900">
						{browser.i18n.getMessage("detail_settings")}
					</h2>
					<AdvancedSettings />
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold leading-6 text-gray-900">
						Links
					</h2>
					<Card className="w-fit">
						<CardContent className="p-4">
							<a
								href="https://github.com/ergofriend/Quiqsearch"
								className="text-blue-600 visited:text-purple-600"
							>
								ergofriend&#x2F;Quiqsearch: A chrome extension. Auto searching
								word you selected.
							</a>
						</CardContent>
					</Card>
					<Card className="w-fit">
						<CardContent className="p-4">
							<a
								href="https://chromewebstore.google.com/detail/quiqserch/aemnbkipehpanmmiicmofabkfllcmajj"
								className="text-blue-600 visited:text-purple-600"
							>
								Quiqserch - Chrome ウェブストア
							</a>
						</CardContent>
					</Card>
				</div>
			</div>
		</DotBackground>
	)
}

export default App
