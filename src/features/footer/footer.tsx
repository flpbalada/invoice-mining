import { useTranslations } from 'next-intl'
import React from 'react'

export function Footer() {
	const t = useTranslations('Footer')
	return (
		<footer className='mt-8 w-full bg-slate-700 text-slate-50'>
			<div className='container mx-auto p-4'>
				<span className='text-xs'>{t('brand', { year: new Date().getFullYear() })}</span>
			</div>
		</footer>
	)
}
