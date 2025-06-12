import { List } from '@/components/list'
import { invoiceMiningJob } from '@/services/invoice-mining-job'
import { $Enums } from '@prisma/client'
import clsx from 'clsx'
import { useFormatter, useTranslations } from 'next-intl'
import { getFormatter, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { FaCheck } from 'react-icons/fa6'

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

	const jobItems = await invoiceMiningJob.getJobItems(jobId, {
		id: true,
		name: true,
		status: true,
		type: true,
		createdAt: true,
		updatedAt: true,
	})

	const jobCreateAtFormatted = format.dateTime(job.createdAt, {
		dateStyle: 'long',
		timeStyle: 'short',
	})

	return (
		<>
			<div className='w-full'>
				<h1 className='mb-4 text-base'>{t('title', { date: jobCreateAtFormatted })}</h1>
			</div>
			<List
				items={jobItems.map(item => ({
					id: item.id,
					item: item,
				}))}
				Item={({ item }) => (
					<>
						<div className='flex items-center font-bold'>{item.name}</div>
						<div className='flex items-center font-bold'>
							<InvoiceTypeBadge type={item.type} />
						</div>
						<div className='flex items-center'>
							<StatusBadge status={item.status} />
						</div>
						<div className='flex items-center'>
							<DateTime date={item.createdAt} />
						</div>
						<div className='flex items-center'>
							<DateTime date={item.updatedAt} />
						</div>
						<div className='flex items-center justify-end'>
							<Link
								className='btn btn-ouline'
								href={`/invoice-mining/results/${jobId}/result/${item.id}`}
							>
								{t('actions.open')}
							</Link>
						</div>
					</>
				)}
				Container={({ children }) => (
					<div className='grid w-full grid-cols-6 gap-2 rounded-lg bg-white p-4 text-sm shadow-md'>
						{[
							t('columns.name'),
							t('columns.type'),
							t('columns.status'),
							t('columns.created'),
							t('columns.updated'),
							'',
						].map((header, idx) => (
							<div key={idx}>{header}</div>
						))}
						<div className='col-span-6 border-b border-b-gray-200'></div>
						{children}
					</div>
				)}
			/>
		</>
	)
}

function StatusBadge({ status }: { status: $Enums.JobItemStatus }) {
	const t = useTranslations('InvoiceMiningResults')

	const mapTypeToTranslationKey: Record<$Enums.JobItemStatus, string> = {
		COMPLETED: 'completed',
		PENDING: 'pending',
		IN_PROGRESS: 'inProgress',
		FAILED: 'failed',
	}

	if (!mapTypeToTranslationKey[status]) {
		throw new Error(`Unknown status: ${status}`)
	}

	const statusTranslationKey = mapTypeToTranslationKey[status]

	return (
		<span className={clsx(status === 'COMPLETED' ? 'badge-success' : 'badge-neutral', 'badge badge-soft')}>
			{statusTranslationKey === 'completed' && <FaCheck />}
			{['pending', 'inProgress'].includes(statusTranslationKey) && (
				<span className='loading loading-spinner loading-xs' />
			)}
			{t(`status.${statusTranslationKey}`)}
		</span>
	)
}

function InvoiceTypeBadge({ type }: { type: $Enums.JobItemType }) {
	const t = useTranslations('InvoiceMiningResults')

	return (
		<span className={clsx(type === 'INVOICE' ? 'badge-primary' : 'badge-secondary', 'badge badge-soft')}>
			{t(`type.${type.toLocaleLowerCase()}`)}
		</span>
	)
}

function DateTime({ date }: { date: Date }) {
	const format = useFormatter()
	const dateFormatted = format.dateTime(date, {
		dateStyle: 'long',
		timeStyle: 'short',
	})
	return <span>{dateFormatted}</span>
}
