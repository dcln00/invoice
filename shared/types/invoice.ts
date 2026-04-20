export type Currency = string

export interface InvoiceItem {
	product: string
	quantity: number
	unit: number
	subtotal: number
}

export interface InvoiceFrom {
	company: string
	address: [string, string]
	email: string
	phone: string
	website: string
}

export interface InvoiceTo {
	company: string
	contactPerson: string
	address: [string, string]
	email: string
	phone: string
}

export interface Invoice {
	invoiceNumber: string
	currency: Currency
	issueDate: string
	dueDate: string
	tax: number
	discount: number
	paymentTerms: string
	from: InvoiceFrom
	to: InvoiceTo
	items: InvoiceItem[]
}

export type InvoiceTemplate = 'Default' | 'Classic' | 'Bubblegum'

export interface InvoiceFormat {
	headerBgColor: string
	headerTextColor: string
	template: InvoiceTemplate
}

export interface MailPayload {
	to: string
	subject: string
	file: string
	filename: string
}
