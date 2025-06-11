export function createSingleton<T>(name: string, initFn: () => T): T {
	const globalRef = global as unknown as Record<string, T>
	const globalKey = `__singleton_${name}`

	const instance = globalRef[globalKey] ?? initFn()

	// Only store in global in development to prevent memory leaks in production
	if (process.env.NODE_ENV !== 'production') {
		globalRef[globalKey] = instance
	}

	return instance
}
