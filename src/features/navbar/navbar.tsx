import Link from 'next/link'
import { NavbarUserMenu } from './navbar-user-menu.client'
import { Suspense } from 'react'
import { auth } from '@/services/auth'
export function Navbar() {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<NavbarBody />
		</Suspense>
	)
}

export async function NavbarBody() {
	const session = await auth()

	const isUserSignedIn = !!session?.user

	return (
		<div className='p-4'>
			<nav className='container mx-auto flex items-center justify-between rounded bg-white p-4 shadow-md'>
				<div
					className='font-serif text-base font-semibold text-slate-900'
					title='stomping a trick = landing it clean'
				>
					<Link href='/'>Vytěžto</Link>
				</div>
				<div>
					<NavbarUserMenu isUserSignedIn={isUserSignedIn} />
				</div>
			</nav>
		</div>
	)
}
