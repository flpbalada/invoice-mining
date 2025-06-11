import { Mistral } from '@mistralai/mistralai'
import { InvoiceMiningJobItem } from './invoice-mining-job-item'
import { InvoiceMiningJob } from './invoice-mining-job'
import { prisma } from './prisma'
import { MistralOCRInvoice } from './mistral-ocr'
import { Logger } from './logger'

class InvoiceMining {
	private db: typeof prisma
	private mistralClient: Mistral
	private mistralOCRInvoice: MistralOCRInvoice
	private invoiceMiningJobItem: InvoiceMiningJobItem
	private invoiceMiningJob: InvoiceMiningJob
	private log: Logger

	private jobItemIdsQueue: string[] = []
	private isProcessing: boolean = false

	constructor({ db, mistralClient, log }: { db: typeof prisma; mistralClient: Mistral; log: Logger }) {
		this.log = log
		this.db = db
		this.mistralClient = mistralClient
		this.mistralOCRInvoice = new MistralOCRInvoice({ mistralClient: this.mistralClient })
		this.invoiceMiningJobItem = new InvoiceMiningJobItem(this.db, this.mistralOCRInvoice)
		this.invoiceMiningJob = new InvoiceMiningJob(this.db, this.invoiceMiningJobItem)
	}

	public async initJob(base64Files: string[]) {
		this.log.info(`Starting invoice mining job with ${base64Files.length} files.`)
		const { jobId, jobItemIds } = await this.invoiceMiningJob.initiate(base64Files)
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

const globalForInvoiceMining = global as unknown as { invoiceMining: InvoiceMining }

const initInvoiceMining = () =>
	new InvoiceMining({
		log: new Logger(),
		db: prisma,
		mistralClient: new Mistral({ apiKey: process.env.MISTRAL_API_KEY }),
	})

export const invoiceMining = globalForInvoiceMining.invoiceMining ?? initInvoiceMining()

if (process.env.NODE_ENV !== 'production') globalForInvoiceMining.invoiceMining = invoiceMining
