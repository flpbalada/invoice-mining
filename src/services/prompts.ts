type PromptID = 'invoice_extraction_v1'

export class Prompts {
	public get(id: PromptID = 'invoice_extraction_v1'): string {
		if (id === 'invoice_extraction_v1') {
			return PROMPT
		}
		throw new Error(`Unknown prompt ID: ${id}`)
	}
}

// TODO: saved in a database. Also using versioning
const PROMPT = `
The goal is to extract structured data from an invoice as JSON, so we can send it to an API that saves it into a database.

Carefully read and understand the entire document.

Evaluate whether the document is an invoice by checking for key details such as the supplier\’s name, address, tax number, invoice number, date, and a breakdown of goods or services provided.

If it is not an invoice, return an empty object \`{{}}\`.

If the document is recognized as an invoice, return a structured JSON object using this schema that represents the extracted information from the document.

Schema:
\`\`\`
{{
    "supplier": {{
        "name": "string",
        "address": "string",
        "zip_code": "string",
        "city": "string",
        "in_number": "string",
        "tin_number": "string",
        "phone": "string",
        "email": "string",
        "website": "string"
    }},
    "invoice": {{
        "invoice_number": "string",
        "created_at": "string",
        "due_date": "string",
        "currency": "string",
        "total_amount_to_be_paid": "number",
        "taxes": "number",
        "reference_number": "string",
        "bank_account_number": "string",
        "bank_name": "string"
    }},
    "items": [
        {{
            "description": "string",
            "quantity": "number",
            "unit_price": "number",
            "total_price": "number"
        }}
    ]
}}
\`\`\`

Before returning the JSON, double-check the values for accuracy and consistency.

Always return only valid JSON. No other text, no explanations, no comments, no markdown. Just the JSON object.`
