export function createSingleton<T>(
	singletonKey: string,
	createInstance: () => T,
	options?: { forceNewInstance?: boolean },
): T {
	if (options?.forceNewInstance) {
		return createInstance()
	}

	const globalScope = global as unknown as Record<string, T>
	const globalSingletonKey = `__singleton_${singletonKey}`

	const instance = globalScope[globalSingletonKey] ?? createInstance()

	globalScope[globalSingletonKey] = instance

	return instance
}
