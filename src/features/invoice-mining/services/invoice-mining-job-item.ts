import { Prisma } from '@prisma/client'
import { invoiceOCR, InvoiceOCR } from './invoice-ocr'
import { prisma } from '../../../services/prisma'
import { catchError } from '../../../utils/catch-error'
import { createSingleton } from '../../../utils/create-singleton'
import { FileWithFileURL } from '../utils/file-with-file-url'
import { s3, Storage } from '../../../services/s3'

export class InvoiceMiningJobItem {
	private db: typeof prisma
	private invoiceOCR: InvoiceOCR
	private s3: Storage

	constructor(db: typeof prisma, invoiceOCR: InvoiceOCR, s3: Storage) {
		this.db = db
		this.invoiceOCR = invoiceOCR
		this.s3 = s3
	}

	public async add(jobId: string, savedFile: FileWithFileURL) {
		const { id } = await this.db.jobItem.create({
			data: {
				jobId,
				fileOriginalName: savedFile.name,
				fileUrl: savedFile.fileUrl,
				fileType: savedFile.type,
				data: {},
				status: 'PENDING',
			},
			select: {
				id: true,
			},
		})

		return id
	}

	public async process(id: string) {
		const jobItem = await this.get(id)

		if (jobItem.status !== 'PENDING') throw new Error(`Job item with ID ${id} is not in PENDING status`)

		await this.update(id, {
			status: 'IN_PROGRESS',
		})

		const tmpfileUrl = await this.s3.getTmpUrl(jobItem.fileUrl)

		const fileType = this._isFileTypeImageOrPdf(jobItem.fileType)

		const invokeProps =
			fileType === 'image'
				? { type: 'image_url' as const, imageUrl: tmpfileUrl }
				: { type: 'document_url' as const, documentUrl: tmpfileUrl }

		const [error, extractedData] = await catchError(this.invoiceOCR.invoke(invokeProps))

		if (error) {
			await this.update(id, {
				status: 'FAILED',
				error: error.message,
			})
			throw error
		}

		await this.update(id, {
			status: 'COMPLETED',
			data: extractedData,
		})
	}

	public async get(id: string, select?: Prisma.JobItemSelect) {
		return await this.db.jobItem.findFirstOrThrow({
			where: { id },
			select,
		})
	}

	public async update(id: string, data: Prisma.JobItemUpdateInput) {
		await this.db.jobItem.update({
			where: { id },
			data,
		})
	}

	private _isFileTypeImageOrPdf(fileType: string): 'image' | 'pdf' {
		if (fileType.startsWith('image/')) return 'image'
		if (fileType === 'application/pdf') return 'pdf'
		throw new Error(`Unsupported file type: ${fileType}`)
	}
}

export const invoiceMiningJobItem = createSingleton(
	'invoiceMiningJobItem',
	() => new InvoiceMiningJobItem(prisma, invoiceOCR, s3),
	{ forceNewInstance: process.env.NODE_ENV === 'development' },
)
