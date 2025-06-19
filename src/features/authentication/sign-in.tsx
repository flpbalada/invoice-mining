import { Box } from '@/components/box'
import { auth, signIn } from '@/services/auth'
import { Button, Input } from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AuthContainer } from './auth-container'

export function SignIn() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInBody />
		</Suspense>
	)
}

async function SignInBody() {
	const t = await getTranslations('SignIn')
	const session = await auth()

	if (session) redirect('/') // User is already signed in

	return (
		<AuthContainer>
			<Box className='mx-auto'>
				<div>
					<h1>{t('title')}</h1>
					<p>{t('description')}</p>
				</div>
				<SignInForm />
			</Box>
		</AuthContainer>
	)
}

function SignInForm() {
	const t = useTranslations('SignInForm')
	return (
		<form
			action={async formData => {
				'use server'
				await signIn('resend', formData)
			}}
			className='flex flex-col gap-4 sm:flex-row'
		>
			<div className='flex-1'>
				<Input
					type='text'
					name='email'
					placeholder={t('email.placeholder')}
					className='input w-full'
				/>
			</div>
			<Button
				type='submit'
				className='btn btn-primary'
			>
				{t('submit')}
			</Button>
		</form>
	)
}
