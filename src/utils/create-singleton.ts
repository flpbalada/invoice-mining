export function createSingleton<T>(name: string, initFn: () => T): T {
	if (process.env.NODE_ENV !== 'production') {
		return initFn()
	}
	const globalRef = global as unknown as Record<string, T>
	const globalKey = `__singleton_${name}`

	const instance = globalRef[globalKey] ?? initFn()

	globalRef[globalKey] = instance

	return instance
}
