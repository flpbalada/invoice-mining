export function isDate(value: unknown): value is Date {
	if (value instanceof Date) {
		return true
	}

	if (typeof value === 'string') {
		// Basic ISO-like check
		const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/
		if (!isoDateRegex.test(value)) {
			return false
		}

		const parsed = new Date(value)
		return !isNaN(parsed.getTime())
	}

	return false
}
