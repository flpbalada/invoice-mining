'use server'

import { invoiceMining } from '@/services/invoice-mining'
import { validateFiles } from '../utils/validate-files'
import { auth } from '@/services/auth'
import { s3 } from '@/services/s3'
import { FileWithFileURL } from '../utils/file-with-file-url'

export async function invoiceMiningUploadFilesFormAction(_prev: string, formData: FormData) {
	const session = await auth()

	const userId = session?.user?.id

	if (!userId) throw new Error('User is not authenticated')

	const filesOriginal = formData.getAll('files') as File[]
	const files = validateFiles(filesOriginal)
	const savedFiles = await saveFiles(files)
	const jobId = await invoiceMining.initJob(savedFiles, userId)
	invoiceMining.requeueAndProcessJobItems()
	return jobId
}

async function saveFiles(files: File[]): Promise<FileWithFileURL[]> {
	const savedFiles: FileWithFileURL[] = []

	for (const file of files) {
		const savedFileUrl = await s3.upload(await getFileBuffer(file), getUniqueFileName(file.name), file.type)
		savedFiles.push({
			name: file.name,
			fileUrl: savedFileUrl,
			size: file.size,
		})
	}

	return savedFiles
}

async function getFileBuffer(file: File) {
	const arrayBuffer = await file.arrayBuffer()
	return Buffer.from(arrayBuffer)
}

function getUniqueFileName(originalName: string) {
	const timestamp = Date.now()
	const random = Math.floor(Math.random() * 1e6)
	const ext = originalName.substring(originalName.lastIndexOf('.')) || ''
	return `${timestamp}-${random}${ext}`
}
