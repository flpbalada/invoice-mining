import { Prisma } from '@prisma/client'
import { MistralOCRInvoice } from './mistral-ocr'
import { prisma } from './prisma'
import { catchError } from '../utils/catch-error'

export class InvoiceMiningJobItem {
	private db: typeof prisma
	private mistralOCR: MistralOCRInvoice

	constructor(db: typeof prisma, mistralOCR: MistralOCRInvoice) {
		this.db = db
		this.mistralOCR = mistralOCR
	}

	public async add(jobId: string, base64File: string) {
		const { id } = await this.db.jobItem.create({
			data: {
				jobId,
				fileBase64: base64File,
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

		const [error, extractedData] = await catchError(this.mistralOCR.invoke(jobItem.fileBase64))

		if (error) {
			await this.update(id, {
				status: 'FAILED',
			})
			throw new Error(`Failed to process job item with ID ${id}: ${error.message}`)
		}

		await this.update(id, {
			status: 'COMPLETED',
			data: extractedData,
		})
	}

	public async get(id: string) {
		const jobItem = await this.db.jobItem.findUnique({
			where: { id },
		})
		if (!jobItem) throw new Error(`Job item with ID ${id} not found`)
		return jobItem
	}

	public async update(id: string, data: Prisma.JobItemUpdateInput) {
		await this.db.jobItem.update({
			where: { id },
			data,
		})
	}
}
