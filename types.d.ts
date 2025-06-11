declare namespace NodeJS {
	interface Process extends NodeJS.Process {
		env: {
			NODE_ENV: 'development' | 'production'
			NEXT_PUBLIC_HOST: string
			AUTH_RESEND_KEY: string
			MISTRAL_API_KEY: string
		}
	}
}
