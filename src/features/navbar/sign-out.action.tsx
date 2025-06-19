'use server'

import { signOut } from '@/services/auth'
import { redirect } from 'next/navigation'

export async function navbarSignOut() {
	await signOut()
	redirect('/auth/sign-in')
}
