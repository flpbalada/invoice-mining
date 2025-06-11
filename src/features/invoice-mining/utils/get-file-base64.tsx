export async function getFileBase64(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)
	return `data:${file.type};base64,${buffer.toString('base64')}`
}
