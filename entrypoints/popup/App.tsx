import { DotBackground } from "@/components/molecules/background"
import { BasicSettings } from "@/components/organisms/basic-settings"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import "./App.css"

const handleOpenOptionsPage = () => {
	browser.runtime.openOptionsPage().catch((error) => {
		console.error(`Failed to open options page: ${error}`)
	})
}

function App() {
	return (
		<DotBackground>
			<div className="grid gap-4 p-4 w-full">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">
						{browser.i18n.getMessage("app_title")}
					</h1>
					<Button
						variant="outline"
						size="icon"
						className="p-0"
						onClick={handleOpenOptionsPage}
					>
						<Settings />
					</Button>
				</div>
				<BasicSettings />
			</div>
		</DotBackground>
	)
}

export default App
