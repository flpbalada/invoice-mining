import { invoiceMiningJobItem } from '@/features/invoice-mining/services/invoice-mining-job-item'
import { invoiceOCR } from '@/features/invoice-mining/services/invoice-ocr'
import { Suspense } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { getTranslations } from 'next-intl/server'
import { InvoiceMiningJobForm } from './invoice-mining-job-form'
import { s3 } from '@/services/s3'

type InvoiceMiningJobProps = {
	jobItemId: string
}

export function InvoiceMiningJob(props: InvoiceMiningJobProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningJobBody {...props} />
		</Suspense>
	)
}

async function InvoiceMiningJobBody({ jobItemId }: InvoiceMiningJobProps) {
	const t = await getTranslations('InvoiceMiningJob')

	const { data, fileUrl } = await invoiceMiningJobItem.get(jobItemId, {
		id: true,
		data: true,
		fileUrl: true,
	})

	const tmpFileUrl = await s3.getTmpUrl(fileUrl)

	const invoiceSchema = invoiceOCR.getInvoiceSchema()
	const parsedData = await invoiceSchema.parseAsync(data)

	const invoiceFormFields = typedEntries(parsedData.invoice).map(([key, value]) => ({
		key,
		value,
	}))

	const supplierFormFields = typedEntries(parsedData.supplier).map(([key, value]) => ({
		key,
		value,
	}))

	const itemsFormFields = parsedData.items.map(item =>
		typedEntries(item).map(([key, value]) => ({
			key,
			value,
		})),
	)

	return (
		<div className='grid w-full grid-cols-12 gap-4'>
			<div className='mg-white col-span-4 space-y-4 rounded bg-white p-4 shadow'>
				<h2>{t('extractedData.title')}</h2>
				<TabGroup>
					<TabList className='tabs tabs-box'>
						<Tab className='tab data-hover:tab-active data-selected:tab-active'>
							{t('extractedData.tabs.invoice')}
						</Tab>
						<Tab className='tab data-hover:tab-active data-selected:tab-active'>
							{t('extractedData.tabs.supplier')}
						</Tab>
						<Tab className='tab data-hover:tab-active data-selected:tab-active'>
							{t('extractedData.tabs.items')}
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel className='my-2 rounded border border-gray-100 p-2'>
							<InvoiceMiningJobForm fields={invoiceFormFields} />
						</TabPanel>
						<TabPanel className='my-2 rounded border border-gray-100 p-2'>
							<InvoiceMiningJobForm fields={supplierFormFields} />
						</TabPanel>
						<TabPanel>
							{itemsFormFields.map((item, key) => (
								<div
									className='my-2 rounded border border-gray-100 p-2'
									key={key}
								>
									<InvoiceMiningJobForm fields={item} />
								</div>
							))}
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
			<div className='col-span-8 overflow-hidden rounded bg-white shadow'>
				<iframe
					src={tmpFileUrl}
					width='100%'
					height='100%'
					title='PDF Viewer'
				/>
			</div>
		</div>
	)
}

function typedEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][]
}
