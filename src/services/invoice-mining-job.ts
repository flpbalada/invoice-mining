import { prisma } from '@/services/prisma'
import { invoiceMiningJobItem, InvoiceMiningJobItem } from './invoice-mining-job-item'
import { createSingleton } from '../utils/create-singleton'
import { Prisma } from '@prisma/client'
import { FileWithBase64 } from '../utils/file-with-base-64'

export class InvoiceMiningJob {
	private db: typeof prisma
	private jobItem: InvoiceMiningJobItem

	constructor(db: typeof prisma, jobItem: InvoiceMiningJobItem) {
		this.db = db
		this.jobItem = jobItem
	}

	public async initiate(filesWithBase64: FileWithBase64[]) {
		const jobId = await this.initiateJob()
		const jobItemIds = await this.initiateJobItems(jobId, filesWithBase64)
		return { jobId, jobItemIds }
	}

	public async getJob(id: string, select: Prisma.JobSelect) {
		return await this.db.job.findFirstOrThrow({
			where: { id },
			select,
		})
	}

	public async getJobItems(jobId: string, select: Prisma.JobItemSelect) {
		return await this.db.jobItem.findMany({
			where: { jobId },
			select,
		})
	}

	private async initiateJob() {
		const { id: jobId } = await this.db.job.create({
			data: {},
			select: {
				id: true,
			},
		})
		return jobId
	}

	private async initiateJobItems(jobId: string, filesWithBase64: FileWithBase64[]) {
		const jobItemIds: string[] = []
		await Promise.all(
			filesWithBase64.map(async fileWithBase64 => {
				const jobItemId = await this.jobItem.add(jobId, fileWithBase64)
				jobItemIds.push(jobItemId)
			}),
		)
		return jobItemIds
	}
}

export const invoiceMiningJob = createSingleton(
	'invoiceMiningJob',
	() => new InvoiceMiningJob(prisma, invoiceMiningJobItem),
)
