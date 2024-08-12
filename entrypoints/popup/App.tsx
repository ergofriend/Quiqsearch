import reactLogo from "@/assets/react.svg"
import "../../assets/tailwind.css" // XXX: no alias import
import { useState } from "react"
import wxtLogo from "/wxt.svg"
import "./App.css"
import { Button } from "react-daisyui"

const handleOpenOptionsPage = () => {
	browser.runtime.openOptionsPage().catch((error) => {
		console.error(`Failed to open options page: ${error}`)
	})
}

function App() {
	const [count, setCount] = useState(0)

	return (
		<>
			<div>
				<a href="https://wxt.dev" target="_blank" rel="noreferrer">
					<img src={wxtLogo} className="logo" alt="WXT logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>WXT + React</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the WXT and React logos to learn more
			</p>
			<Button color="primary" size="sm" onClick={handleOpenOptionsPage}>
				{browser.i18n.getMessage("detail_settings")}
			</Button>
		</>
	)
}

export default App
