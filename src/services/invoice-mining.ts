import { invoiceMiningJobItem, InvoiceMiningJobItem } from './invoice-mining-job-item'
import { invoiceMiningJob, InvoiceMiningJob } from './invoice-mining-job'
import { log, Logger } from './logger'
import { createSingleton } from '../utils/create-singleton'
import { FileWithBase64 } from '../utils/file-with-base-64'

class InvoiceMining {
	private invoiceMiningJobItem: InvoiceMiningJobItem
	private invoiceMiningJob: InvoiceMiningJob
	private log: Logger

	private jobItemIdsQueue: string[] = []
	private isProcessing: boolean = false

	constructor({
		log,
		invoiceMiningJob,
		invoiceMiningJobItem,
	}: {
		log: Logger
		invoiceMiningJob: InvoiceMiningJob
		invoiceMiningJobItem: InvoiceMiningJobItem
	}) {
		this.log = log
		this.invoiceMiningJobItem = invoiceMiningJobItem
		this.invoiceMiningJob = invoiceMiningJob
	}

	public async initJob(filesWithBase64: FileWithBase64[]) {
		this.log.info(`Starting invoice mining job with ${filesWithBase64.length} files.`)
		const { jobId, jobItemIds } = await this.invoiceMiningJob.initiate(filesWithBase64)
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
}

export const invoiceMining = createSingleton(
	'invoiceMining',
	() =>
		new InvoiceMining({
			log: log,
			invoiceMiningJob: invoiceMiningJob,
			invoiceMiningJobItem: invoiceMiningJobItem,
		}),
)
