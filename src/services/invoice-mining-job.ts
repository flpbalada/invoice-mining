import { prisma } from '@/services/prisma'
import { InvoiceMiningJobItem } from './invoice-mining-job-item'

export class InvoiceMiningJob {
	private db: typeof prisma
	private jobItem: InvoiceMiningJobItem

	constructor(db: typeof prisma, jobItem: InvoiceMiningJobItem) {
		this.db = db
		this.jobItem = jobItem
	}

	public async initiate(base64Files: string[]) {
		const jobId = await this.initiateJob()
		const jobItemIds = await this.initiateJobItems(jobId, base64Files)
		return { jobId, jobItemIds }
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

	private async initiateJobItems(jobId: string, base64Files: string[]) {
		const jobItemIds: string[] = []
		await Promise.all(
			base64Files.map(async base64 => {
				const jobItemId = await this.jobItem.add(jobId, base64)
				jobItemIds.push(jobItemId)
			}),
		)
		return jobItemIds
	}
}
