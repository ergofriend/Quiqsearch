import { Button } from "react-daisyui"

import "../../assets/tailwind.css" // XXX: no alias import

function App() {
	return (
		<div>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<p className="text-blue-600">detail page</p>
			<button type="button" className="btn btn-primary">
				Button
			</button>
			<Button color="primary">Click me!</Button>
		</div>
	)
}

export default App
