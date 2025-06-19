'use server'

import { invoiceMiningJob } from '@/features/invoice-mining/services/invoice-mining-job'

export async function invoiceMiningGetJobItemsAction(jobId: string) {
	return await invoiceMiningJob.getJobItems(
		jobId,
		{
			id: true,
			fileUrl: true,
			fileOriginalName: true,
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
