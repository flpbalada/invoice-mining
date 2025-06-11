import { InvoiceMining } from '@/features/invoice-mining/invoice-mining'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<InvoiceMining
			step='results'
			jobId={id}
		/>
	)
}
