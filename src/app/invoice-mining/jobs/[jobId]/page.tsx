import { InvoiceMining } from '@/features/invoice-mining/invoice-mining'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
	const { jobId } = await params
	return (
		<InvoiceMining
			step='jobs'
			jobId={jobId}
		/>
	)
}
