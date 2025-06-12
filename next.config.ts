import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '30mb',
		},
	},
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
