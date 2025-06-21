'use client'

import { ReactNode, useActionState, useState } from 'react'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa6'
import { invoiceMiningUploadFilesFormAction } from '../actions/invoice-mining-upload-files-form-action'
import { useTranslations } from 'next-intl'

export function InvoiceMiningUploadFilesForm() {
	const t = useTranslations('InvoiceMiningUploadFilesForm')
	const [filesCount, setFilesCount] = useState(0)
	const [jobId, formAction, pending] = useActionState(invoiceMiningUploadFilesFormAction, '')

	if (jobId) {
		return <InvoiceMiningUploadFilesFormSuccess jobId={jobId} />
	}

	return (
		<form action={formAction}>
			<InvoiceMiningUploadFilesFormContainer>
				<div>
					<label
						htmlFor='files'
						className='mb-2 block text-sm font-medium text-slate-700'
					>
						{t('inputFile.label')}
					</label>
					<input
						id='files'
						name='files'
						type='file'
						accept='.pdf,.jpg,.jpeg,.png'
						multiple
						className='file-input'
						disabled={pending || jobId.length > 0}
						onChange={e => setFilesCount(e.currentTarget.files?.length ?? 0)}
					/>
				</div>
				<button
					className='btn btn-primary'
					disabled={filesCount === 0 || pending}
				>
					{pending && <span className='loading loading-spinner loading-sm'></span>}
					{t('submit')}
				</button>
			</InvoiceMiningUploadFilesFormContainer>
		</form>
	)
}

function InvoiceMiningUploadFilesFormSuccess({ jobId }: { jobId: string }) {
	const t = useTranslations('InvoiceMiningUploadFilesForm')

	return (
		<InvoiceMiningUploadFilesFormContainer>
			<div className='alert alert-success alert-soft'>
				<FaCheck />
				<span>{t('successBox.message')}</span>
			</div>
			<Link
				href={`/invoice-mining/jobs/${jobId}`}
				type='submit'
				className='btn btn-success'
			>
				{t('viewResults')}
			</Link>
		</InvoiceMiningUploadFilesFormContainer>
	)
}

function InvoiceMiningUploadFilesFormContainer({ children }: { children: ReactNode }) {
	return <div className='my-2 flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-md'>{children}</div>
}
