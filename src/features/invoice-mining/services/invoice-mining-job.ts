import { prisma } from '@/services/prisma'
import { invoiceMiningJobItem, InvoiceMiningJobItem } from './invoice-mining-job-item'
import { createSingleton } from '../../../utils/create-singleton'
import { Prisma } from '@prisma/client'
import { FileWithFileURL } from '../utils/file-with-file-url'

export class InvoiceMiningJob {
	private db: typeof prisma
	private jobItem: InvoiceMiningJobItem

	constructor(db: typeof prisma, jobItem: InvoiceMiningJobItem) {
		this.db = db
		this.jobItem = jobItem
	}

	public async initiate(savedFiles: FileWithFileURL[], ownerId: string) {
		const jobId = await this.initiateJob(ownerId)
		const jobItemIds = await this.initiateJobItems(jobId, savedFiles)
		return { jobId, jobItemIds }
	}

	public async getJob(id: string, select: Prisma.JobSelect) {
		return await this.db.job.findFirstOrThrow({
			where: { id },
			select,
		})
	}

	public async getJobItems(
		jobId: string,
		select: Prisma.JobItemSelect,
		orderBy?: Prisma.JobItemOrderByWithRelationInput,
	) {
		return await this.db.jobItem.findMany({
			where: { jobId },
			select,
			orderBy: orderBy,
		})
	}

	private async initiateJob(ownerId: string) {
		const { id: jobId } = await this.db.job.create({
			data: {
				owner: {
					connect: {
						id: ownerId,
					},
				},
			},
			select: {
				id: true,
			},
		})
		return jobId
	}

	private async initiateJobItems(jobId: string, savedFiles: FileWithFileURL[]) {
		const jobItemIds: string[] = []
		await Promise.all(
			savedFiles.map(async savedFile => {
				const jobItemId = await this.jobItem.add(jobId, savedFile)
				jobItemIds.push(jobItemId)
			}),
		)
		return jobItemIds
	}
}

export const invoiceMiningJob = createSingleton(
	'invoiceMiningJob',
	() => new InvoiceMiningJob(prisma, invoiceMiningJobItem),
	{
		forceNewInstance: process.env.NODE_ENV === 'development',
	},
)
