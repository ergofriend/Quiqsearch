import { DotBackground } from "@/components/molecules/background"
import { AdvancedSettings } from "@/components/organisms/advanced-settings"
import { Card, CardContent } from "@/components/ui/card"
import { Cover } from "@/components/ui/cover"

function App() {
	return (
		<DotBackground>
			<div className="w-full overflow-auto flex flex-col gap-8 px-24 py-10">
				<h1 className="text-4xl font-bold tracking-tight">
					{browser.i18n.getMessage("app_title")}
				</h1>

				<h2
					style={{ lineHeight: 1.5 }}
					className="text-4xl break-keep md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white"
				>
					{browser.i18n.getMessage("option_description_1")}
					<span className="px-2">
						<Cover>{browser.i18n.getMessage("option_description_2")}</Cover>
					</span>
					{browser.i18n.getMessage("option_description_3")}
				</h2>

				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-semibold leading-6">
						{browser.i18n.getMessage("detail_settings")}
					</h2>
					<AdvancedSettings />
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold leading-6">Links</h2>
					<div className="flex gap-4">
						<Card className="w-fit">
							<a
								href={browser.i18n.getMessage("link_github_url")}
								className="text-blue-600 visited:text-purple-600"
							>
								<CardContent className="p-4">
									{browser.i18n.getMessage("link_github")}
								</CardContent>
							</a>
						</Card>
						<Card className="w-fit">
							<a
								href={browser.i18n.getMessage("link_chrome_web_store_url")}
								className="text-blue-600 visited:text-purple-600"
							>
								<CardContent className="p-4">
									{browser.i18n.getMessage("link_chrome_web_store")}
								</CardContent>
							</a>
						</Card>
					</div>
				</div>
			</div>
		</DotBackground>
	)
}

export default App
