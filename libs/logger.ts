type Logger = {
	info: (...args: unknown[]) => void
	log: (...args: unknown[]) => void
	warn: (...args: unknown[]) => void
	error: (...args: unknown[]) => void
	debug: (...args: unknown[]) => void
}

const dummyLogger = {
	info: () => {},
	log: () => {},
	warn: () => {},
	error: () => {},
	debug: () => {},
} satisfies Logger

export const logger =
	import.meta.env.MODE === "development" ? console : dummyLogger
