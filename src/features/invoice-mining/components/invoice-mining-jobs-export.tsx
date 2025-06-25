'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { Fragment } from 'react'
import toast from 'react-hot-toast'
import { FaDownload } from 'react-icons/fa6'

export function InvoiceMiningJobsExport({ jobId }: { jobId: string }) {
	const t = useTranslations('InvoiceMiningJobsExport')

	const handleExport = (format: string, jobId: string) => {
		toast(t('notImplemented', { format, jobId }))
	}

	return (
		<Menu as={Fragment}>
			<MenuButton className='btn'>
				{t('download')}
				<FaDownload />
			</MenuButton>
			<MenuItems
				anchor='bottom end'
				as='ul'
				className='menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm'
			>
				<MenuItem as='li'>
					<button onClick={() => handleExport('csv', jobId)}>{t('downloadCSV')}</button>
				</MenuItem>
				<MenuItem as='li'>
					<button onClick={() => handleExport('json', jobId)}>{t('downloadJSON')}</button>
				</MenuItem>
				<MenuItem as='li'>
					<button onClick={() => handleExport('xlsx', jobId)}>{t('downloadXLSX')}</button>
				</MenuItem>
				<MenuItem as='li'>
					<button onClick={() => handleExport('google_sheets', jobId)}>{t('exportGoogleSheets')}</button>
				</MenuItem>
			</MenuItems>
		</Menu>
	)
}
