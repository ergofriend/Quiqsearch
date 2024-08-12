import reactLogo from "@/assets/react.svg"
import { BasicSettings } from "@/components/organisms/basic-settings"
import "../../assets/tailwind.css" // XXX: no alias import
import "./App.css"

const handleOpenOptionsPage = () => {
	browser.runtime.openOptionsPage().catch((error) => {
		console.error(`Failed to open options page: ${error}`)
	})
}

function App() {
	return (
		<div className="flex flex-col gap-4">
			<a href="https://react.dev" target="_blank" rel="noreferrer">
				<img src={reactLogo} className="logo react" alt="React logo" />
			</a>
			<BasicSettings />
			<button type="button" onClick={handleOpenOptionsPage}>
				{browser.i18n.getMessage("detail_settings")}
			</button>
		</div>
	)
}

export default App
