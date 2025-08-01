import { invoiceMining } from '@/features/invoice-mining/services/invoice-mining'

export function GET() {
	const isProcessing = invoiceMining.getIsProcessing()
	if (isProcessing) return new Response('Invoice mining jobs are already being processed.', { status: 429 })
	invoiceMining.requeueAndProcessJobItems()
	return new Response('Processing invoice mining jobs...', { status: 200 })
}
