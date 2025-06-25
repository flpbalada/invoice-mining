'use client'

import { List } from '@/components/list'
import { $Enums } from '@prisma/client'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { invoiceMiningGetJobItemsAction } from '../actions/invoice-mining-get-job-items-action'
import { useRouter } from 'next/navigation'
import { TableGrid } from '@/components/table-grid'
import { InvoiceMiningJobsExport } from './invoice-mining-jobs-export'

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
					name: item.fileOriginalName,
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
				<TableGrid.Row>
					<TableGrid.Cell>{item.name}</TableGrid.Cell>
					<TableGrid.Cell>
						<InvoiceTypeBadge type={item.type} />
					</TableGrid.Cell>
					<TableGrid.Cell>
						<StatusBadge status={item.status} />
					</TableGrid.Cell>
					<TableGrid.Cell>
						<TableGrid.DateTime date={item.createdAt} />
					</TableGrid.Cell>
					<TableGrid.Cell>
						<TableGrid.DateTime date={item.updatedAt} />
					</TableGrid.Cell>
					<TableGrid.Cell justify='end'>
						<button
							disabled={item.status !== 'COMPLETED'}
							className='btn btn-primary btn-sm btn-soft'
							onClick={() => handleJobItemClick(item.id)}
						>
							{t('actions.open')}
						</button>
					</TableGrid.Cell>
				</TableGrid.Row>
			)}
			Container={({ children }) => (
				<TableGrid columns={6}>
					<TableGrid.Head>
						<TableGrid.Cell>{t('columns.name')}</TableGrid.Cell>
						<TableGrid.Cell>{t('columns.type')}</TableGrid.Cell>
						<TableGrid.Cell>{t('columns.status')}</TableGrid.Cell>
						<TableGrid.Cell>{t('columns.created')}</TableGrid.Cell>
						<TableGrid.Cell>{t('columns.updated')}</TableGrid.Cell>
						<TableGrid.Cell justify='end'>
							<InvoiceMiningJobsExport jobId={jobId} />
						</TableGrid.Cell>
					</TableGrid.Head>
					<TableGrid.Body>{children}</TableGrid.Body>
				</TableGrid>
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
