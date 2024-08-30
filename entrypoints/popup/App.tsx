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
			<div className="flex flex-col gap-4 p-4">
				<BasicSettings />
				<button type="button" onClick={handleOpenOptionsPage}>
					{browser.i18n.getMessage("detail_settings")}
				</button>
				<Button
					variant="outline"
					size="icon"
					className="p-0"
					onClick={handleOpenOptionsPage}
				>
					<Settings />
				</Button>
			</div>
		</DotBackground>
	)
}

export default App
