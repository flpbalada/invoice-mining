import { InvoiceMiningContainer } from './components/invoice-mining-container'
import { InvoiceMiningHero } from './components/invoice-mining-hero'
import { InvoiceMiningResult } from './components/invoice-mining-result'
import { InvoiceMiningResults } from './components/invoice-mining-results'
import { InvoiceMiningUploadFilesForm } from './components/invoice-mining-upload-files-form'

type UploadStepProps = {
	step: 'upload'
}

type ResultsStepProps = {
	step: 'results'
	jobId: string
}

type ResultStepProps = {
	step: 'result'
	jobItemId: string
}

type InvoiceMiningProps = UploadStepProps | ResultsStepProps | ResultStepProps

export function InvoiceMining(props: InvoiceMiningProps) {
	const { step } = props

	if (step === 'results') {
		return (
			<InvoiceMiningContainer>
				<InvoiceMiningResults jobId={props.jobId} />
			</InvoiceMiningContainer>
		)
	}

	if (step === 'result') {
		return (
			<InvoiceMiningContainer>
				<InvoiceMiningResult jobItemId={props.jobItemId} />
			</InvoiceMiningContainer>
		)
	}

	return (
		<InvoiceMiningContainer>
			<InvoiceMiningHero />
			<InvoiceMiningUploadFilesForm />
		</InvoiceMiningContainer>
	)
}
