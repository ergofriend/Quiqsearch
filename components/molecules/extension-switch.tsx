import { logger } from "@/libs/logger"
import { storage } from "wxt/storage"

const STORAGE_KEY = "sync:isDisable"

const useSyncState = () => {
	const [isInitialized, setIsInitialized] = useState(false)
	const [isDisabled, setIsDisabled] = useState(false)

	useEffect(() => {
		const init = async () => {
			const _isDisable = await storage.getItem<boolean>(STORAGE_KEY)
			setIsDisabled(!!_isDisable)
			setIsInitialized(true)
			logger.log(STORAGE_KEY, ":init:", _isDisable)
		}
		init()

		const unwatch = storage.watch<boolean>(STORAGE_KEY, (_isDisable) => {
			setIsDisabled(!!_isDisable)
			logger.log(STORAGE_KEY, ":synced:", !!_isDisable)
		})
		return () => unwatch()
	}, [setIsInitialized, setIsDisabled])

	const onChangeState = useCallback((_isDisable: boolean) => {
		logger.log(STORAGE_KEY, ":changed:", _isDisable)
		storage.setItem(STORAGE_KEY, _isDisable)
	}, [])

	return {
		isInitialized,
		isDisabled,
		onChangeState,
	}
}

export const ExtensionSwitch = () => {
	const state = useSyncState()
	return (
		<div className="select-none">
			<label htmlFor="extension-switch">
				{browser.i18n.getMessage("extension_switch")}
				<input
					id="extension-switch"
					type="checkbox"
					className="switch switch-primary"
					disabled={!state.isInitialized}
					checked={!state.isDisabled}
					onChange={(e) => state.onChangeState(!e.target.checked)}
				/>
			</label>
		</div>
	)
}
