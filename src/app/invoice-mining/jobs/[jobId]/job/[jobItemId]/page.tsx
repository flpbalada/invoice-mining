import { InvoiceMining } from '@/features/invoice-mining/invoice-mining'

export default async function Page({ params }: { params: Promise<{ jobItemId: string; jobId: string }> }) {
	const { jobItemId, jobId } = await params

	return (
		<InvoiceMining
			step='job'
			jobId={jobId}
			jobItemId={jobItemId}
		/>
	)
}
