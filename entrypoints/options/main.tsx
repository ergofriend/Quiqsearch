import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

const target = document.getElementById("root")

if (!target) {
	throw new Error("Failed to find root element")
}

ReactDOM.createRoot(target).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
