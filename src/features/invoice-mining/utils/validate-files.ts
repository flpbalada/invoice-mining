const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export function validateFiles(files: File[]): File[] {
	if (!Array.isArray(files) || files.length === 0) {
		throw new Error('No files provided')
	}
	return files.filter(validateFile)
}

function validateFile(file: File): File {
	if (file.size === 0) {
		throw new Error('File is empty')
	}

	if (file.size > MAX_FILE_SIZE) {
		// 10 MB limit
		throw new Error(`File size exceeds ${MAX_FILE_SIZE} MB limit`)
	}

	return file
}
