import { auth } from '@/services/auth'
import { Suspense } from 'react'
import { invoiceMining } from '../services/invoice-mining'
import { InvoiceMiningJobsByUserList } from './invoice-mining-jobs-by-user-list.client'

export function InvoiceMiningJobsByUser() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningJobsByUserBody />
		</Suspense>
	)
}

async function InvoiceMiningJobsByUserBody() {
	const session = await auth()

	if (!session || session?.user?.id === undefined) {
		throw new Error(
			'Unauthorized access: You do not have permission to view invoice mining jobs. Please log in with an authorized account.',
		)
	}

	const ownerId = session.user.id

	const { jobs } = await invoiceMining.listJobsByOwner(ownerId, 1, 10)

	if (!jobs || jobs.length === 0) return false

	return <InvoiceMiningJobsByUserList initialJobs={jobs} />
}
