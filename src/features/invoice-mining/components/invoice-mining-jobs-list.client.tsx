'use client'

import { List } from '@/components/list'
import { $Enums } from '@prisma/client'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { useFormatter } from 'use-intl'
import { invoiceMiningGetJobItemsAction } from '../actions/invoice-mining-get-job-items-action'
import { useRouter } from 'next/navigation'

type JobItem = {
	id: string
	name: string
	type: $Enums.JobItemType
	status: $Enums.JobItemStatus
	createdAt: Date
	updatedAt: Date
}

type InvoiceMiningJobsListProps = {
	initialJobItems: JobItem[]
	jobId: string
}

export function InvoiceMiningJobsList({ initialJobItems, jobId }: InvoiceMiningJobsListProps) {
	const t = useTranslations('InvoiceMiningJobs')
	const [jobItems, setJobItems] = useState<JobItem[]>(initialJobItems)

	const { push } = useRouter()

	const areAllJobItemsResolved = useCallback(
		() => jobItems.every(item => item.status === 'COMPLETED' || item.status === 'FAILED'),
		[jobItems],
	)

	useEffect(() => {
		const refetchJobItems = async () => {
			const allResolved = areAllJobItemsResolved()

			if (allResolved) {
				clearInterval(interval)
				return
			}

			const items = await invoiceMiningGetJobItemsAction(jobId)
			setJobItems(
				items.map(item => ({
					id: item.id,
					name: item.name,
					type: item.type,
					status: item.status,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
				})),
			)
		}
		const interval = setInterval(refetchJobItems, 2000) // every 2 sec
		return () => clearInterval(interval)
	}, [areAllJobItemsResolved, jobId])

	const handleJobItemClick = useCallback(
		(jobItemId: string) => {
			const url = `/invoice-mining/jobs/${jobId}/job/${jobItemId}`
			push(url)
		},
		[jobId, push],
	)

	return (
		<List
			items={jobItems.map(item => ({
				id: item.id,
				item: item,
			}))}
			Item={({ item }) => (
				<>
					<div className='flex items-center font-bold'>{item.name}</div>
					<div className='flex items-center'>
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
						<button
							disabled={item.status !== 'COMPLETED'}
							className='btn btn-primary btn-sm btn-soft'
							onClick={() => handleJobItemClick(item.id)}
						>
							{t('actions.open')}
						</button>
					</div>
				</>
			)}
			Container={({ children }) => (
				<div className='w-full overflow-x-auto rounded-lg bg-white p-4 shadow-md'>
					<div className='grid w-full min-w-4xl grid-cols-6 gap-2 text-sm'>
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
						<div className='col-span-6 border-b border-b-gray-200' />
						{children}
					</div>
				</div>
			)}
		/>
	)
}

function StatusBadge({ status }: { status: $Enums.JobItemStatus }) {
	const t = useTranslations('InvoiceMiningJobs')

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
	const t = useTranslations('InvoiceMiningJobs')

	return <span className='badge badge-info badge-soft'>{t(`type.${type.toLocaleLowerCase()}`)}</span>
}

function DateTime({ date }: { date: Date }) {
	const format = useFormatter()
	const dateFormatted = format.dateTime(date, {
		dateStyle: 'long',
		timeStyle: 'short',
	})
	return <span>{dateFormatted}</span>
}
