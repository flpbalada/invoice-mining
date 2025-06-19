import { auth } from '@/services/auth'
import { redirect } from 'next/navigation'

type InvoiceMiningLayoutProps = Readonly<{
	children: React.ReactNode
}>

export default async function InvoiceMiningLayout({ children }: InvoiceMiningLayoutProps) {
	const session = await auth()
	const isUserSignedIn = !!session?.user

	if (!isUserSignedIn) {
		redirect('/auth/sign-in')
	}

	return <div>{children}</div>
}
