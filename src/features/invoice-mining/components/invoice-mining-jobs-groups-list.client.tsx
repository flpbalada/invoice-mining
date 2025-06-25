'use client'

import { List } from '@/components/list'
import { TableGrid } from '@/components/table-grid'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

type JobsGroup = {
	id: string
	createdAt: Date
	updatedAt: Date
}

type InvoiceMiningJobsGroupProps = {
	initialJobsGroups: JobsGroup[]
}

export function InvoiceMiningJobsGroupsList({ initialJobsGroups }: InvoiceMiningJobsGroupProps) {
	const t = useTranslations('InvoiceMiningJobs')
	const [jobsGroups] = useState<JobsGroup[]>(initialJobsGroups)

	return (
		<List
			items={jobsGroups.map(jobsGroup => ({
				id: jobsGroup.id,
				item: jobsGroup,
			}))}
			Item={({ item }) => (
				<TableGrid.Row>
					<TableGrid.Cell>
						<TableGrid.DateTime date={item.createdAt} />
					</TableGrid.Cell>

					<TableGrid.Cell justify='end'>
						<Link
							href={`/invoice-mining/jobs/${item.id}`}
							className='btn btn-primary btn-sm btn-soft'
						>
							{t('actions.open')}
						</Link>
					</TableGrid.Cell>
				</TableGrid.Row>
			)}
			Container={({ children }) => (
				<TableGrid columns={2}>
					<TableGrid.Head>
						{[t('columns.created'), ''].map((header, idx) => (
							<div key={idx}>{header}</div>
						))}
					</TableGrid.Head>
					<TableGrid.Body>{children}</TableGrid.Body>
				</TableGrid>
			)}
		/>
	)
}
