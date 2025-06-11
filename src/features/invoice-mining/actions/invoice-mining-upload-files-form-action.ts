'use server'

import { invoiceMining } from '@/services/invoice-mining'
import { getFileBase64 } from '../utils/get-file-base64'
import { validateFiles } from '../utils/validate-files'

export async function invoiceMiningUploadFilesFormAction(_prev: string, formData: FormData) {
	const filesOriginal = formData.getAll('files') as File[]
	const files = validateFiles(filesOriginal)
	const base64Files = await Promise.all(files.map(async file => await getFileBase64(file)))
	const jobId = invoiceMining.initJob(base64Files)
	return jobId
}
