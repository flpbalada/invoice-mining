// lib/s3.ts
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { createSingleton } from '../utils/create-singleton'

class Storage {
	private s3: S3Client
	private bucket: string
	private spaceEndpoint: string

	constructor({ s3, bucket, spaceEndpoint }: { s3: S3Client; bucket: string; spaceEndpoint: string }) {
		this.s3 = s3
		this.bucket = bucket
		this.spaceEndpoint = spaceEndpoint
	}

	public async upload(file: Buffer, filename: string, contentType: string) {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: filename,
			Body: file,
			ContentType: contentType,
			ACL: 'private',
		})

		await this.s3.send(command)

		return filename
	}

	public async getFileAsBase64(filename: string) {
		const command = new GetObjectCommand({
			Bucket: process.env.DO_SPACE_BUCKET,
			Key: filename,
		})

		const response = await this.s3.send(command)

		if (!response.Body || typeof response.Body === 'string') {
			throw new Error('Invalid file body')
		}

		const chunks: Uint8Array[] = []
		for await (const chunk of response.Body as unknown as AsyncIterable<Uint8Array>) {
			chunks.push(chunk)
		}

		return chunks
	}
}

const s3Client = new S3Client({
	region: 'fra1',
	endpoint: process.env.DO_SPACE_ENDPOINT,
	credentials: {
		accessKeyId: process.env.DO_SPACE_KEY,
		secretAccessKey: process.env.DO_SPACE_SECRET,
	},
})

export const s3 = createSingleton(
	's3',
	() =>
		new Storage({
			s3: s3Client,
			bucket: process.env.DO_SPACE_BUCKET,
			spaceEndpoint: process.env.DO_SPACE_ENDPOINT,
		}),
)
