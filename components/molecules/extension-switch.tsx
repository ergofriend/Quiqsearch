export const ExtensionSwitch = () => {
	return (
		<div className="select-none">
			<label htmlFor="extension-switch">
				{browser.i18n.getMessage("extension_switch")}
				<input
					id="extension-switch"
					type="checkbox"
					className="switch switch-primary"
					defaultChecked
				/>
			</label>
		</div>
	)
}
