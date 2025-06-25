export function createSingleton<T>(singletonKey: string, createInstance: () => T, onlyInProduction: boolean = true): T {
	if (!onlyInProduction) {
		return createInstance()
	}
	const globalScope = global as unknown as Record<string, T>
	const globalSingletonKey = `__singleton_${singletonKey}`

	const instance = globalScope[globalSingletonKey] ?? createInstance()

	globalScope[globalSingletonKey] = instance

	return instance
}
