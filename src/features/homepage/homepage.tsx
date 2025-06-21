import { auth } from '@/services/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export async function Homepage() {
	const session = await auth()
	if (session) redirect('/invoice-mining')
	return (
		<div>
			<div className='mx-auto grid max-w-5xl gap-16 px-6 py-12'>
				<h1 className='text-center'>Vytěžování faktur</h1>
				<section className='text-center'>
					<div className='grid gap-8 md:grid-cols-3'>
						<div>
							<h3 className='mb-2 text-lg font-bold'>1. Nahrajte faktury</h3>
							<p>Nahrajte soubory ve formátu .pdf. Můžete přetáhnout více souborů najednou.</p>
						</div>
						<div>
							<h3 className='mb-2 text-lg font-bold'>2. Vytěžení údajů</h3>
							<p>
								Naše AI rozpozná důležité informace, jako číslo účtu, variabilní symbol, položky a
								další.
							</p>
						</div>
						<div>
							<h3 className='mb-2 text-lg font-bold'>3. Export dat</h3>
							<p>Vytěžené údaje můžete jednoduše exportovat do .csv, Excelu nebo Google Sheets.</p>
						</div>
					</div>
				</section>

				<section className='rounded-2xl bg-white p-8 text-center shadow-lg'>
					<h2 className='mb-4 text-2xl font-semibold'>Cenový model</h2>
					<div className='mb-6 flex flex-col items-center justify-center gap-2'>
						<span className='inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700'>
							10 faktur zdarma každý měsíc
						</span>
						<span className='inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700'>
							Poté jen 1&nbsp;Kč / faktura
						</span>
					</div>
					<p className='mb-6'>Platíte pohodlně pomocí předplacených kreditů. Žádné závazky.</p>
					<Link
						href='/auth/sign-in'
						className='btn btn-primary btn-lg'
					>
						Vyzkoušet zdarma
					</Link>
				</section>

				<section className='text-center'>
					<h2 className='mb-4 text-2xl font-semibold'>Pro koho je služba?</h2>
					<p className='mx-auto max-w-2xl'>
						Ideální pro podnikatele, živnostníky, účetní a malé až střední firmy, které chtějí ušetřit čas
						při zpracování dokladů a mít data připravena pro analýzy či účetní systémy.
					</p>
				</section>
			</div>
		</div>
	)
}
