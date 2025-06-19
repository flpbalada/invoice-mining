import { invoiceMiningJobItem, InvoiceMiningJobItem } from './invoice-mining-job-item'
import { invoiceMiningJob, InvoiceMiningJob } from './invoice-mining-job'
import { log, Logger } from './logger'
import { createSingleton } from '../utils/create-singleton'
import { prisma } from './prisma'
import { FileWithFileURL } from '../features/invoice-mining/utils/file-with-file-url'

class InvoiceMining {
	private db: typeof prisma
	private invoiceMiningJobItem: InvoiceMiningJobItem
	private invoiceMiningJob: InvoiceMiningJob
	private log: Logger

	private jobItemIdsQueue: string[] = []
	private isProcessing: boolean = false

	constructor({
		db,
		log,
		invoiceMiningJob,
		invoiceMiningJobItem,
	}: {
		db: typeof prisma
		log: Logger
		invoiceMiningJob: InvoiceMiningJob
		invoiceMiningJobItem: InvoiceMiningJobItem
	}) {
		this.db = db
		this.log = log
		this.invoiceMiningJobItem = invoiceMiningJobItem
		this.invoiceMiningJob = invoiceMiningJob
	}

	public async initJob(savedFiles: FileWithFileURL[], ownerId: string) {
		this.log.info(`Starting invoice mining job with ${savedFiles.length} files.`)
		const { jobId, jobItemIds } = await this.invoiceMiningJob.initiate(savedFiles, ownerId)
		jobItemIds.forEach(id => this.jobItemIdsQueue.push(id))
		this.log.info(`Job initiated with ID: ${jobId} and ${jobItemIds.length} items.`)
		return jobId
	}

	public getIsProcessing() {
		this.log.info(`Is processing: ${this.isProcessing}`)
		return this.isProcessing
	}

	public async processJobItems(maxIterations: number = 50, maxConcurrentJobs: number = 5) {
		this.log.info(
			`Processing ${this.jobItemIdsQueue.length} job items with maxIterations: ${maxIterations}, maxConcurrentJobs: ${maxConcurrentJobs}`,
		)
		this.isProcessing = true
		const promises: Promise<void>[] = []
		let iterationCount = 0
		while (this.jobItemIdsQueue.length > 0 && iterationCount < maxIterations) {
			const jobItemId = this.jobItemIdsQueue.shift()
			if (!jobItemId) continue
			const promise = this.invoiceMiningJobItem.process(jobItemId)
			promises.push(promise)
			iterationCount++

			if (promises.length >= maxConcurrentJobs) {
				await Promise.all(promises)
				promises.length = 0
			}
		}
		// Process any remaining promises, because the last batch might not fill up to maxConcurrentJobs
		if (promises.length > 0) {
			await Promise.all(promises)
		}
		this.isProcessing = false
		this.log.info(`Finished processing job items. Processed ${iterationCount} items.`)
	}

	public async requeueAndProcessJobItems() {
		await this.requeueFailedJobItems()
		await this.processJobItems()
	}

	public async requeueFailedJobItems() {
		this.log.info('Requeuing failed job items...')
		const failedJobItems = await this.db.jobItem.findMany({
			where: { status: 'FAILED' },
			select: { id: true },
		})

		if (failedJobItems.length === 0) {
			this.log.info('No failed job items to requeue.')
			return
		}

		for (const item of failedJobItems) {
			await this.db.jobItem.update({
				where: { id: item.id },
				data: { status: 'PENDING', error: null },
			})
			this.jobItemIdsQueue.push(item.id)
		}

		this.log.info(`Requeued ${failedJobItems.length} failed job items.`)
	}
}

export const invoiceMining = createSingleton(
	'invoiceMining',
	() =>
		new InvoiceMining({
			db: prisma,
			log: log,
			invoiceMiningJob: invoiceMiningJob,
			invoiceMiningJobItem: invoiceMiningJobItem,
		}),
)
