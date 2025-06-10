import { useCallback } from 'react'

export function useShare() {
	const share = useCallback(async (data: { title?: string; text?: string; url: string }) => {
		try {
			// Always copy to clipboard
			await navigator.clipboard.writeText(data.url)

			// Then try to share if available
			if (navigator.share) {
				await navigator.share(data)
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// Ignore share cancellation errors
			if (
				typeof error === 'object' &&
				error !== null &&
				(('name' in error && error.name === 'AbortError') ||
					('message' in error && /cancel/i.test(error.message)))
			) {
				return
			}
		}
	}, [])

	return { share }
}
