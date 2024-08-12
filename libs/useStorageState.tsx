import type { StorageItemKey } from "wxt/storage"
import { logger } from "./logger"

export const useStorageState = <T,>(
	storageKey: StorageItemKey,
	defaultState: T,
) => {
	const [isInitialized, setIsInitialized] = useState(false)

	const [state, setState] = useState<T>(defaultState)

	useEffect(() => {
		const init = async () => {
			const _state = await storage.getItem<T>(storageKey)
			setState(_state ?? defaultState)
			setIsInitialized(true)
			logger.log(storageKey, ":init:", _state)
		}
		init()

		const unwatch = storage.watch<T>(storageKey, (_state) => {
			setState(_state ?? defaultState)
			logger.log(storageKey, ":synced:", _state)
		})
		return () => unwatch()
	}, [setIsInitialized, setState])

	const onChangeState = useCallback((_state: T) => {
		logger.log(storageKey, ":changed:", _state)
		storage.setItem(storageKey, _state)
	}, [])

	return {
		isInitialized,
		current: state,
		onChangeState,
	}
}
