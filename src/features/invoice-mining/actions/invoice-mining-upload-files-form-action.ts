'use server'

import { invoiceMining } from '@/services/invoice-mining'
import { getFileBase64 } from '../utils/get-file-base64'
import { validateFiles } from '../utils/validate-files'
import { auth } from '@/services/auth'

export async function invoiceMiningUploadFilesFormAction(_prev: string, formData: FormData) {
	const session = await auth()

	const userId = session?.user?.id

	if (!userId) {
		throw new Error('User is not authenticated')
	}

	const filesOriginal = formData.getAll('files') as File[]
	const files = validateFiles(filesOriginal)
	const filesWithBase64 = await Promise.all(
		files.map(async file => ({
			name: file.name,
			base64: await getFileBase64(file),
		})),
	)
	const jobId = await invoiceMining.initJob(filesWithBase64, userId)
	invoiceMining.requeueAndProcessJobItems()
	return jobId
}
