'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { log } from '@/services/logger'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const t = useTranslations('Error')

	useEffect(() => {
		log.error('Error in Error.tsx', error)
	}, [error])

	return (
		<main className='my-8 flex flex-col items-center justify-center gap-4 p-4 text-center'>
			<p className='rouded-lg mb-4 rounded border border-red-200 bg-red-50 p-2 text-xs font-medium'>
				{error.digest}
			</p>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<p>{t('suggestion')}</p>
			<div className='my-4 flex flex-col gap-4 md:flex-row'>
				<button
					className='btn btn-primary'
					onClick={() => reset()}
				>
					{t('tryAgain')}
				</button>
				<Link
					href='/'
					className='btn btn-secondary'
				>
					{t('goToHomepage')}
				</Link>
			</div>
			<p className='text-sm text-gray-500'>
				{t('contactSupport')}{' '}
				<a
					href={`mailto:${t('contactEmail')}`}
					className='underline'
				>
					{t('contactEmail')}
				</a>
			</p>
		</main>
	)
}
