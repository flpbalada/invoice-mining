import { useTranslations } from 'next-intl'

export function InvoiceMiningHero() {
	const t = useTranslations('InvoiceMiningHero')
	return (
		<>
			<h1 className='mb-4 text-center text-4xl font-bold'>{t('title')}</h1>
			<p className='mb-8 max-w-2xl text-center text-lg text-gray-700'>{t('description')}</p>
		</>
	)
}
