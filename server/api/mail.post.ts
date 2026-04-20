import nodemailer from 'nodemailer'
import type { MailPayload } from '~~/shared/types/invoice'

const MAIL_SENDER_NAME = 'Invoice by Nii Aryeh'
const MAIL_SERVICE = 'zoho'

const isValidPayload = (body: unknown): body is MailPayload => {
	if (!body || typeof body !== 'object') return false
	const { to, subject, file, filename } = body as Record<string, unknown>
	return (
		typeof to === 'string' && to.length > 0 &&
		typeof subject === 'string' && subject.length > 0 &&
		typeof file === 'string' && file.length > 0 &&
		typeof filename === 'string' && filename.length > 0
	)
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!isValidPayload(body)) {
		throw createError({ statusCode: 400, statusMessage: 'Invalid mail payload' })
	}

	const config = useRuntimeConfig(event)

	if (!config.mailUser || !config.mailPass) {
		throw createError({ statusCode: 500, statusMessage: 'Mail transport not configured' })
	}

	const transporter = nodemailer.createTransport({
		service: MAIL_SERVICE,
		auth: { user: config.mailUser, pass: config.mailPass },
	})

	await transporter.verify()

	await transporter.sendMail({
		from: { name: MAIL_SENDER_NAME, address: config.mailUser },
		to: body.to,
		subject: body.subject,
		headers: {
			'X-Priority': '3',
			'X-MSMail-Priority': 'Normal',
			'Importance': 'normal',
			'X-Mailer': 'Invoice App',
		},
		text: 'Invoice attached. Please find your invoice in the attached PDF file.',
		attachments: [{ filename: body.filename, path: body.file }],
	})

	return { message: 'Email sent' }
})
