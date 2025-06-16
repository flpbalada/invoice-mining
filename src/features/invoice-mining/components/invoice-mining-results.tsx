import { invoiceMiningJob } from '@/services/invoice-mining-job'
import { getFormatter, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { InvoiceMiningResultsList } from './invoice-mining-results-list.client'
import { invoiceMiningGetJobItemsAction } from '../actions/invoice-mining-get-job-items-action'

type InvoiceMiningResultsProps = {
	jobId: string
}

export function InvoiceMiningResults(props: InvoiceMiningResultsProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningResultsBody {...props} />
		</Suspense>
	)
}

async function InvoiceMiningResultsBody({ jobId }: { jobId: string }) {
	const t = await getTranslations('InvoiceMiningResults')
	const format = await getFormatter()

	const job = await invoiceMiningJob.getJob(jobId, {
		createdAt: true,
	})

	const jobItems = await invoiceMiningGetJobItemsAction(jobId)

	const jobCreateAtFormatted = format.dateTime(job.createdAt, {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<>
			<div className='w-full'>
				<h1 className='mb-4 text-base'>{t('title', { date: jobCreateAtFormatted })}</h1>
			</div>
			<InvoiceMiningResultsList
				initialJobItems={jobItems.map(item => ({
					id: item.id,
					name: item.name,
					status: item.status,
					type: item.type,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
				}))}
				jobId={jobId}
			/>
		</>
	)
}
