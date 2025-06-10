'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { log } from '@/services/logger'

export function GlobalErrorHandler() {
	const t = useTranslations('GlobalErrorHandler')

	useEffect(() => {
		const handleError = (event: ErrorEvent) => {
			log.error('Unhandled global error:', event.error)
			toast.error(t('error'))
		}

		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			log.error('Unhandled promise rejection:', event.reason)
			toast.error(t('error'))
		}

		window.addEventListener('error', handleError)
		window.addEventListener('unhandledrejection', handleUnhandledRejection)

		return () => {
			window.removeEventListener('error', handleError)
			window.removeEventListener('unhandledrejection', handleUnhandledRejection)
		}
	}, [t])

	return null
}
