import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'

import './globals.css'

import { Navbar } from '@/features/navbar/navbar'
import { Footer } from '@/features/footer/footer'
import { GlobalErrorHandler } from '@/components/errors'

export const metadata: Metadata = {
	title: 'TODO title',
	description: 'TODO description',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider>
					<GlobalErrorHandler />
					<div className='flex min-h-screen flex-col justify-between'>
						<Navbar />
						<div>{children}</div>
						<Footer />
					</div>
					<Toaster />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
