import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import Resend from 'next-auth/providers/resend'

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Resend({
			apiKey: process.env.AUTH_RESEND_KEY,
			from: 'prihlaseni@vytezeno.cz',
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
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa;">
  <h2 style="color: #000000; margin-bottom: 16px;">Vítejte na <strong>${host}</strong></h2>
  <p style="margin-bottom: 20px;">Obdrželi jsme žádost o přihlášení k vašemu účtu. Pokračujte kliknutím na tlačítko níže:</p>
  <p style="margin-bottom: 24px;">
    <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Přihlásit se</a>
  </p>
  <p style="font-size: 14px; color: #888; margin-bottom: 24px;">Pokud jste o přihlášení nežádali, tento e-mail můžete ignorovat.</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
  <p style="font-size: 13px; color: #666;">
    Raději odkaz zkopírujete a vložíte ručně? Tady je:
    <br />
    <a href="${url}" style="color: #000000; word-break: break-all;">${url}</a>
  </p>
</div>
	`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
	return `Sign in to ${host}\n${url}\n\n`
}
