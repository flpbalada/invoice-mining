import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'

import './globals.css'

import { Navbar } from '@/features/navbar/navbar'
import { Footer } from '@/features/footer/footer'
import { GlobalErrorHandler } from '@/components/errors'

export const metadata: Metadata = {
	title: 'Chytré vytěžování faktur pomocí AI | Vytěženo.cz',
	description:
		'Ideální pro podnikatele, živnostníky, účetní a malé až střední firmy, které chtějí ušetřit čas při zpracování dokladů a mít data připravena pro analýzy či účetní systémy.',
}

type RootLayoutProps = Readonly<{
	children: React.ReactNode
}>

export default async function RootLayout({ children }: RootLayoutProps) {
	const locale = await getLocale()

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider>
					<GlobalErrorHandler />
					<div className='flex min-h-screen flex-col justify-between'>
						<Navbar />
						<div className='flex-1 p-4'>{children}</div>
						<Footer />
					</div>
					<Toaster />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
