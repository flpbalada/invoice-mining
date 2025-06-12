import { invoiceMiningJobItem } from '@/services/invoice-mining-job-item'
import { Suspense } from 'react'

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
	const item = await invoiceMiningJobItem.get(jobItemId, {
		id: true,
		data: true,
		fileBase64: true,
	})
	return (
		<div className='grid w-full grid-cols-2 gap-4'>
			<div>
				<iframe
					src={item.fileBase64}
					width='100%'
					height='100%'
					title='PDF Viewer'
				/>
			</div>
			<div>
				<pre>{JSON.stringify(item.data, null, 2)}</pre>
			</div>
		</div>
	)
}
