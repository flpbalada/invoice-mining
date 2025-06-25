import { InvoiceMiningContainer } from './components/invoice-mining-container'
import { InvoiceMiningJobs } from './components/invoice-mining-jobs'
import { InvoiceMiningJob } from './components/invoice-mining-job'
import { InvoiceMiningUploadFilesForm } from './components/invoice-mining-upload-files-form'

type UploadStepProps = {
	step: 'upload'
}

type JobsStepProps = {
	step: 'jobs'
	jobId: string
}

type JobStepProps = {
	step: 'job'
	jobItemId: string
}

type InvoiceMiningProps = UploadStepProps | JobsStepProps | JobStepProps

export function InvoiceMining(props: InvoiceMiningProps) {
	const { step } = props

	if (step === 'jobs') {
		return (
			<InvoiceMiningContainer>
				<InvoiceMiningJobs jobId={props.jobId} />
			</InvoiceMiningContainer>
		)
	}

	if (step === 'job') {
		return (
			<InvoiceMiningContainer>
				<InvoiceMiningJob jobItemId={props.jobItemId} />
			</InvoiceMiningContainer>
		)
	}

	return (
		<InvoiceMiningContainer>
			<InvoiceMiningUploadFilesForm />
		</InvoiceMiningContainer>
	)
}
