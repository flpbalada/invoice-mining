import { Mistral } from '@mistralai/mistralai'

const globalForMistral = global as unknown as { mistral: Mistral }
export const mistral = globalForMistral.mistral ?? new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
if (process.env.NODE_ENV !== 'production') globalForMistral.mistral = mistral
