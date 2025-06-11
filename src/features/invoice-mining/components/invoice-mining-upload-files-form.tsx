'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa6'
import { invoiceMiningUploadFilesFormAction } from '../actions/invoice-mining-upload-files-form-action'

export function InvoiceMiningUploadFilesForm() {
	const [state, formAction, pending] = useActionState(invoiceMiningUploadFilesFormAction, '')

	return (
		<form
			className='my-2 flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-md'
			action={formAction}
		>
			<div>
				<label
					htmlFor='files'
					className='mb-2 block text-sm font-medium text-slate-700'
				>
					Vyberte faktury (PDF nebo obrázky):
				</label>
				<input
					id='files'
					name='files'
					type='file'
					accept='.pdf'
					multiple
					className='file-input'
					disabled={pending || state.length > 0}
				/>
			</div>
			{state.length > 0 && (
				<div className='alert alert-success alert-soft'>
					<FaCheck />
					<span>
						Faktury byly přidány do fronty a vytěžování dat do tabulky právě probíhá. Výsledky budou k
						dispozici nejdéle do pár minut.
					</span>
				</div>
			)}
			{state.length === 0 ? (
				<button
					className='btn btn-primary'
					disabled={state.length > 0 || pending}
				>
					odeslat
				</button>
			) : (
				<Link
					href={`/invoice-mining/results/${state}`}
					type='submit'
					className='btn btn-success'
				>
					Přejít na výsledky
				</Link>
			)}
		</form>
	)
}
