type ApiHeaders = Record<string, string>

export class MyApi {
	private host: string

	constructor({ host }: { host: string }) {
		this.host = host
	}

	public async get<T>({
		path,
		queryParams,
		headers,
	}: {
		path: string
		queryParams?: Record<string, string>
		headers?: ApiHeaders
	}): Promise<T> {
		const url = this._buildUrl(path, queryParams)
		return await this._performRequest<T>(url, {
			method: 'GET',
			headers,
		})
	}

	public async post<T, B>({ path, body, headers }: { path: string; body: B; headers?: ApiHeaders }): Promise<T> {
		const url = this._buildUrl(path)
		return await this._performRequest<T>(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			body: JSON.stringify(body),
		})
	}

	private async _performRequest<T>(url: string, options: RequestInit): Promise<T> {
		const response = await fetch(url, options)
		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
		}
		const data = await response.json()
		return data
	}

	private _buildUrl(path: string, queryParams?: Record<string, string>): string {
		const url = new URL(path, this.host)
		if (queryParams) {
			Object.entries(queryParams).forEach(([key, value]) => {
				url.searchParams.append(key, value)
			})
		}
		return url.toString()
	}
}
