import { invoiceMiningJob } from '@/features/invoice-mining/services/invoice-mining-job'
import { getFormatter, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { invoiceMiningGetJobItemsAction } from '../actions/invoice-mining-get-job-items-action'
import { InvoiceMiningJobsList } from './invoice-mining-jobs-list.client'

type InvoiceMiningJobsProps = {
	jobId: string
}

export function InvoiceMiningJobs(props: InvoiceMiningJobsProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningJobsBody {...props} />
		</Suspense>
	)
}

async function InvoiceMiningJobsBody({ jobId }: { jobId: string }) {
	const t = await getTranslations('InvoiceMiningJobs')
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
			<div>
				<button>{t('download')}</button>
			</div>
			<InvoiceMiningJobsList
				initialJobItems={jobItems.map(item => ({
					id: item.id,
					name: item.fileOriginalName,
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
