import { Mistral } from '@mistralai/mistralai'
import { z } from 'zod'
import { responseFormatFromZodObject } from '@mistralai/mistralai/extra/structChat'
import { createSingleton } from '../utils/create-singleton'
import { mistral } from './mistral'
import { retry } from '../utils/retry'

type Model = 'mistral-ocr-latest'

export class MistralOCR {
	private client: Mistral

	constructor({ mistralClient }: { mistralClient: Mistral }) {
		this.client = mistralClient
	}

	public async invoke(documentUrl: string) {
		return await this._getDocumentInJSON(documentUrl)
	}

	public getInvoiceSchema() {
		return this._invoiceSchema
	}

	private async _getDocumentInJSON(documentUrl: string) {
		const { documentAnnotation } = await this._processDocument({
			documentUrl: documentUrl,
		})

		if (!documentAnnotation) {
			throw new Error('Document annotation is missing in the response')
		}

		return this._invoiceSchema.parseAsync(JSON.parse(documentAnnotation))
	}

	private async _processDocument({
		documentUrl,
		model = 'mistral-ocr-latest',
		includeImageBase64 = false,
	}: {
		documentUrl: string
		model?: Model
		includeImageBase64?: boolean
	}) {
		const documentAnnotationFormat = responseFormatFromZodObject(this._invoiceSchema)
		const ocrProcessPromise = this.client.ocr.process({
			model,
			document: {
				type: 'document_url',
				documentUrl,
			},
			documentAnnotationFormat,
			includeImageBase64,
		})
		return await retry(() => ocrProcessPromise)
	}

	private _invoiceSchema = z.object({
		supplier: z.object({
			name: z.string().optional().describe('Supplier name'),
			address: z.string().optional().describe('Supplier address'),
			zip_code: z.string().optional().describe('Supplier zip code'),
			city: z.string().optional().describe('Supplier city'),
			in_number: z
				.string()
				.optional()
				.describe('Supplier identification number (e.g., company registration number)'),
			tin_number: z.string().optional().describe('Supplier tax identification number'),
			phone: z.string().optional().describe('Supplier phone number'),
			email: z.string().optional().describe('Supplier email address'),
			website: z.string().optional().describe('Supplier website'),
		}),
		invoice: z.object({
			invoice_number: z.string().optional().describe('Invoice number'),
			created_at: z.string().optional().describe('Invoice creation date'),
			due_date: z.string().optional().describe('Invoice due date'),
			currency: z.string().optional().describe('Invoice currency'),
			total_amount_to_be_paid: z.number().optional().describe('Total amount to be paid'),
			taxes: z.number().optional().describe('Taxes amount'),
			reference_number: z.string().optional().describe('Reference number (e.g., variable symbol)'),
			bank_account_number: z.string().optional().describe('Bank account number'),
			bank_name: z.string().optional().describe('Bank name'),
		}),
		items: z.array(
			z.object({
				description: z.string().optional().describe('Item description'),
				quantity: z.number().optional().describe('Item quantity'),
				unit_price: z.number().optional().describe('Item unit price'),
				total_price: z.number().optional().describe('Item total price'),
			}),
		),
	})
}

export const mistralOCR = createSingleton('mistralOCR', () => {
	return new MistralOCR({
		mistralClient: mistral,
	})
})
