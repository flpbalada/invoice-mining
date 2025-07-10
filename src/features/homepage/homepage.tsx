import { auth } from '@/services/auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export async function Homepage() {
	const session = await auth()
	if (session) redirect('/invoice-mining')
	return (
		<div>
			<div className='mx-auto grid max-w-5xl gap-16 px-4 md:px-12'>
				<div className='flex flex-col items-center gap-6 md:gap-4'>
					<div className='animate-fade-in'>
						<Image
							src='/images/hero.png'
							width={400}
							height={400}
							alt='Ilustrační obrázek fakturace'
							priority
						/>
					</div>
					<h1 className='max-w-prose text-center text-3xl leading-tight font-extrabold tracking-tight md:text-5xl md:leading-snug'>
						Chytré vytěžování faktur pomocí AI
					</h1>
					<p className='mb-2 max-w-xl text-center text-lg text-gray-600 md:text-xl'>
						Ušetřete čas a získejte přesná data z faktur během pár vteřin. Jednoduše, rychle a bezpečně.
					</p>
					<Link
						href='/auth/sign-in'
						className='btn btn-primary btn-lg shadow-md transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:outline-none'
					>
						Vyzkoušet zdarma
					</Link>
				</div>
				<section className='text-center'>
					<div className='grid gap-8 md:grid-cols-3'>
						<div className='card bg-base-100'>
							<div className='card-body items-center text-center'>
								<div className='mb-4'>
									<div className='avatar avatar-placeholder'>
										<div className='text-neutral-content flex w-12 items-center justify-center rounded-full bg-gray-600 font-bold'>
											<span>1</span>
										</div>
									</div>
								</div>
								<h3 className='mb-2 text-lg font-bold'>Nahrajte faktury</h3>
								<p>Nahrajte soubory ve formátu .pdf. Můžete přetáhnout více souborů najednou.</p>
							</div>
						</div>
						<div className='card bg-base-100'>
							<div className='card-body items-center text-center'>
								<div className='mb-4'>
									<div className='avatar avatar-placeholder'>
										<div className='text-neutral-content flex w-12 items-center justify-center rounded-full bg-gray-600 font-bold'>
											<span>2</span>
										</div>
									</div>
								</div>
								<h3 className='mb-2 text-lg font-bold'>Vytěžení údajů</h3>
								<p>
									Naše AI rozpozná důležité informace, jako číslo účtu, variabilní symbol, položky a
									další.
								</p>
							</div>
						</div>
						<div className='card bg-base-100'>
							<div className='card-body items-center text-center'>
								<div className='mb-4'>
									<div className='avatar avatar-placeholder'>
										<div className='text-neutral-content flex w-12 items-center justify-center rounded-full bg-gray-600 font-bold'>
											<span>3</span>
										</div>
									</div>
								</div>
								<h3 className='mb-2 text-lg font-bold'>Export dat</h3>
								<p>Vytěžené údaje můžete jednoduše exportovat do .csv, Excelu nebo Google Sheets.</p>
							</div>
						</div>
					</div>
				</section>

				<section className='bg-base-100 rounded-2xl p-8 text-center'>
					<h2 className='mb-4 text-2xl font-semibold'>Pro koho je služba?</h2>
					<p className='mx-auto mb-6 max-w-2xl'>
						Ideální pro podnikatele, živnostníky, účetní a malé až střední firmy, které chtějí ušetřit čas
						při zpracování dokladů a mít data připravena pro analýzy či účetní systémy.
					</p>
					<div className='flex flex-wrap justify-center gap-4'>
						<div className='badge border-none bg-blue-50 text-blue-700'>Podnikatelé</div>
						<div className='badge border-none bg-green-50 text-green-700'>Živnostníci</div>
						<div className='badge border-none bg-yellow-50 text-yellow-700'>Účetní</div>
						<div className='badge border-none bg-purple-50 text-purple-700'>Malé firmy</div>
						<div className='badge border-none bg-pink-50 text-pink-700'>Střední firmy</div>
					</div>
				</section>
			</div>
		</div>
	)
}
