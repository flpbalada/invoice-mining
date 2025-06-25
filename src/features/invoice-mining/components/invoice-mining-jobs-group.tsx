import { auth } from '@/services/auth'
import { Suspense } from 'react'
import { invoiceMining } from '../services/invoice-mining'
import { InvoiceMiningJobsGroupsList } from './invoice-mining-jobs-groups-list.client'

export function InvoiceMiningJobsGroups() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningJobsGroupsBody />
		</Suspense>
	)
}

async function InvoiceMiningJobsGroupsBody() {
	const session = await auth()

	if (!session || session?.user?.id === undefined) {
		throw new Error(
			'Unauthorized access: You do not have permission to view invoice mining jobs. Please log in with an authorized account.',
		)
	}

	const ownerId = session.user.id

	const { jobsGroups } = await invoiceMining.listJobsGroupsByOwner(ownerId, 1, 10)

	if (!jobsGroups || jobsGroups.length === 0) return false

	return <InvoiceMiningJobsGroupsList initialJobsGroups={jobsGroups} />
}
