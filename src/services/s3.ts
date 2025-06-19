// lib/s3.ts
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { createSingleton } from '../utils/create-singleton'

export class Storage {
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

		return this._getUrl(filename)
	}

	public async getTmpUrl(filePath: string, expiresIn: number = 3600) {
		const cleanedFilePath = this._getCleanedFilePath(filePath)
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: cleanedFilePath,
		})
		return await getSignedUrl(this.s3, command, { expiresIn })
	}

	private _getCleanedFilePath(fileUrl: string) {
		const spaceEndpointWithBucketName = `${this.spaceEndpoint}/${this.bucket}`
		let path = fileUrl.replace(spaceEndpointWithBucketName, '')
		if (path.startsWith('/')) {
			path = path.slice(1)
		}
		return path
	}

	private _getUrl(filename: string): string {
		return `${this.spaceEndpoint}/${this.bucket}/${filename}`
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
