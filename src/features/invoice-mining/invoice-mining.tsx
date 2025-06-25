import { InvoiceMiningContainer } from './components/invoice-mining-container'
import { InvoiceMiningJobs } from './components/invoice-mining-jobs'
import { InvoiceMiningJob } from './components/invoice-mining-job'
import { InvoiceMiningUploadFilesForm } from './components/invoice-mining-upload-files-form'
import { InvoiceMiningBreadcrumb } from './components/invoice-mining-breadcrumb'
import { useTranslations } from 'next-intl'
import { InvoiceMiningJobsByUser } from './components/invoice-mining-jobs-by-user'

type UploadStepProps = {
	step: 'upload'
}

type JobsStepProps = {
	step: 'jobs'
	jobId: string
}

type JobStepProps = {
	step: 'job'
	jobId: string
	jobItemId: string
}

type InvoiceMiningProps = UploadStepProps | JobsStepProps | JobStepProps

export function InvoiceMining(props: InvoiceMiningProps) {
	const t = useTranslations('InvoiceMining')
	const { step } = props

	if (step === 'jobs') {
		return (
			<InvoiceMiningContainer>
				<div className='w-full'>
					<InvoiceMiningBreadcrumb
						items={[
							{ type: 'link', label: t('breadcrumb.uploadFiles'), href: '/invoice-mining' },
							{
								type: 'basic',
								label: t('breadcrumb.jobs'),
							},
						]}
					/>
				</div>
				<InvoiceMiningJobs jobId={props.jobId} />
			</InvoiceMiningContainer>
		)
	}

	if (step === 'job') {
		return (
			<InvoiceMiningContainer>
				<div className='w-full'>
					<InvoiceMiningBreadcrumb
						items={[
							{ type: 'link', label: t('breadcrumb.uploadFiles'), href: '/invoice-mining' },
							{
								type: 'link',
								label: t('breadcrumb.jobs'),
								href: `/invoice-mining/jobs/${props.jobId}`,
							},
							{
								type: 'basic',
								label: t('breadcrumb.documentDetails'),
							},
						]}
					/>
				</div>
				<InvoiceMiningJob jobItemId={props.jobItemId} />
			</InvoiceMiningContainer>
		)
	}

	return (
		<InvoiceMiningContainer>
			<div className='w-full space-y-4'>
				<InvoiceMiningUploadFilesForm />
				<InvoiceMiningJobsByUser />
			</div>
		</InvoiceMiningContainer>
	)
}
