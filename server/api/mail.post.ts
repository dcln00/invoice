import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const config = useRuntimeConfig(event)

	const transporter = nodemailer.createTransport({
		service: 'zoho',
		auth: {
			user: config.mailUser,
			pass: config.mailPass,
		},
	})

	await transporter.verify()

	await transporter.sendMail({
		from: {
			name: 'Invoice by Nii Aryeh',
			address: config.mailUser
		},
		to: body.to,
		subject: body.subject,
		headers: {
			'X-Priority': '3',
			'X-MSMail-Priority': 'Normal',
			'Importance': 'normal',
			'X-Mailer': 'Invoice App'
		},
		text: `Invoice attached. Please find your invoice in the attached PDF file.`,
		attachments: [
			{
				filename: body.filename,
				path: body.file
			},
		]
	})

	return { message: 'Email sent' }
})