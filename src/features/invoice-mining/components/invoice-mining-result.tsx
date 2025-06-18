import { invoiceMiningJobItem } from '@/services/invoice-mining-job-item'
import { mistralOCR } from '@/services/mistral-ocr'
import { Suspense } from 'react'
import { InvoiceMiningResultForm } from './invoice-mining-result-form'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { getTranslations } from 'next-intl/server'

type InvoiceMiningResultProps = {
	jobItemId: string
}

export function InvoiceMiningResult(props: InvoiceMiningResultProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<InvoiceMiningResultBody {...props} />
		</Suspense>
	)
}

async function InvoiceMiningResultBody({ jobItemId }: InvoiceMiningResultProps) {
	const t = await getTranslations('InvoiceMiningResult')

	const { data, fileBase64 } = await invoiceMiningJobItem.get(jobItemId, {
		id: true,
		data: true,
		fileBase64: true,
	})

	const invoiceSchema = mistralOCR.getInvoiceSchema()
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
							<InvoiceMiningResultForm fields={invoiceFormFields} />
						</TabPanel>
						<TabPanel className='my-2 rounded border border-gray-100 p-2'>
							<InvoiceMiningResultForm fields={supplierFormFields} />
						</TabPanel>
						<TabPanel>
							{itemsFormFields.map((item, key) => (
								<div
									className='my-2 rounded border border-gray-100 p-2'
									key={key}
								>
									<InvoiceMiningResultForm fields={item} />
								</div>
							))}
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
			<div className='col-span-8 overflow-hidden rounded bg-white shadow'>
				<iframe
					src={fileBase64}
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
