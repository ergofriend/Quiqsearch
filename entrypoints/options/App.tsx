import { BasicSettings } from "@/components/organisms/basic-settings"
import "../../assets/tailwind.css" // XXX: no alias import

function App() {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-3xl">{browser.i18n.getMessage("detail_settings")}</h1>
			<BasicSettings />
		</div>
	)
}

export default App
