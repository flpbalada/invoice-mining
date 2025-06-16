'use server'

import { invoiceMiningJob } from '@/services/invoice-mining-job'

export async function invoiceMiningGetJobItemsAction(jobId: string) {
	return await invoiceMiningJob.getJobItems(
		jobId,
		{
			id: true,
			name: true,
			status: true,
			type: true,
			createdAt: true,
			updatedAt: true,
		},
		{
			createdAt: 'asc',
		},
	)
}
