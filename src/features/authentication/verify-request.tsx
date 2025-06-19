import { useTranslations } from 'next-intl'
import { AuthContainer } from './auth-container'

export function VerifyRequest() {
	const t = useTranslations('VerifyRequest')
	return (
		<AuthContainer>
			<h1 className='mb-4 text-2xl font-bold'>{t('title')}</h1>
			<p className='mb-6 text-lg'>{t('description')}</p>
			<p className='text-sm text-gray-500'>{t('postfix')}</p>
		</AuthContainer>
	)
}
