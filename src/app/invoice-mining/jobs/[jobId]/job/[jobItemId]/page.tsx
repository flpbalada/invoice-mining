import { InvoiceMining } from '@/features/invoice-mining/invoice-mining'

export default async function Page({ params }: { params: Promise<{ jobItemId: string }> }) {
	const { jobItemId } = await params
	return (
		<InvoiceMining
			step='job'
			jobItemId={jobItemId}
		/>
	)
}
