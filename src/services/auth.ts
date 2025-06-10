import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import Resend from 'next-auth/providers/resend'

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: 'no-reply@impactshelf.com',
			async sendVerificationRequest(params) {
				const { identifier: to, provider, url } = params
				const { host } = new URL(url)
				const res = await fetch('https://api.resend.com/emails', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${provider.apiKey}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						from: provider.from,
						to,
						subject: `Sign in to ${host}`,
						html: html({ url, host }),
						text: text({ url, host }),
					}),
				})

				if (!res.ok) throw new Error('Resend error: ' + JSON.stringify(await res.json()))
			},
		}),
	],
})

function html({ url, host }: { url: string; host: string }) {
	return `
		<div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
			<h2>Sign in to ${host} 🌀⚡️</h2>
			<p>Click the button below to sign in to ${host} 👇</p>
			<p>
				<a href="${url}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;">
					Sign in
				</a>
			</p>
			<p>If the button doesn't work, copy and paste this link into your browser:</p>
			<p><a href="${url}">${url}</a></p>
			<hr />
			<p style="font-size:12px;color:#888;">If you did not request this email, you can safely ignore it.</p>
		</div>
	`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`
}
