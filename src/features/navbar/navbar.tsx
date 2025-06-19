import Link from 'next/link'
import { NavbarUserMenu } from './navbar-user-menu.client'
import { ReactNode, Suspense } from 'react'
import { auth } from '@/services/auth'
export function Navbar() {
	return (
		<Suspense fallback={<NavbarLoading />}>
			<NavbarBody />
		</Suspense>
	)
}

export async function NavbarBody() {
	const session = await auth()

	const isUserSignedIn = !!session?.user

	return (
		<NavbarContainer>
			<NavbarBrand />
			<NavbarUserMenu isUserSignedIn={isUserSignedIn} />
		</NavbarContainer>
	)
}

function NavbarLoading() {
	return (
		<NavbarContainer>
			<NavbarBrand />
			<div className='skeleton h-10 w-10 rounded-full' />
		</NavbarContainer>
	)
}

function NavbarBrand() {
	return (
		<div className='font-serif text-base font-semibold text-slate-900'>
			<Link href='/'>Vytěženo.cz (beta)</Link>
		</div>
	)
}

function NavbarContainer({ children }: { children: ReactNode }) {
	return (
		<div className='p-4'>
			<nav className='container mx-auto flex items-center justify-between rounded bg-white p-4 shadow-md'>
				{children}
			</nav>
		</div>
	)
}
