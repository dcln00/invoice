import { useStorage } from '@vueuse/core'
import type { Invoice, InvoiceItem } from '~~/shared/types/invoice'

const STORAGE_KEY = 'invoice'
const PERCENT = 100

const emptyItem = (): InvoiceItem => ({
	product: '',
	quantity: 0,
	unit: 0,
	subtotal: 0,
})

const defaultInvoice = (): Invoice => ({
	invoiceNumber: 'INV-001',
	currency: 'GHS',
	issueDate: getTodayDate(),
	dueDate: getDueDate(),
	tax: 0,
	discount: 0,
	paymentTerms: '',
	from: {
		company: '',
		address: ['', ''],
		email: '',
		phone: '',
		website: '',
	},
	to: {
		company: '',
		contactPerson: '',
		address: ['', ''],
		email: '',
		phone: '',
	},
	items: [emptyItem()],
})

export const useInvoice = () => {
	const invoice = useStorage<Invoice>(STORAGE_KEY, defaultInvoice(), undefined, {
		mergeDefaults: true,
	})

	invoice.value.issueDate = getTodayDate()
	invoice.value.dueDate = getDueDate()
	invoice.value.paymentTerms = invoice.value.paymentTerms.replace(/<[^>]*>/g, '')

	const reset = (): void => {
		invoice.value = defaultInvoice()
	}

	const addItem = (): void => {
		invoice.value.items.push(emptyItem())
	}

	const removeItem = (index: number): void => {
		invoice.value.items.splice(index, 1)
	}

	const recalcSubtotal = (index: number): void => {
		const item = invoice.value.items[index]
		if (!item) return
		item.subtotal = item.quantity * item.unit
	}

	const subtotal = computed<number>(() =>
		invoice.value.items.reduce((acc, item) => acc + item.subtotal, 0),
	)

	const taxAmount = computed<number>(() => subtotal.value * (invoice.value.tax / PERCENT))
	const discountAmount = computed<number>(() => subtotal.value * (invoice.value.discount / PERCENT))
	const grandTotal = computed<number>(() => subtotal.value + taxAmount.value - discountAmount.value)

	return {
		invoice,
		reset,
		addItem,
		removeItem,
		recalcSubtotal,
		subtotal,
		taxAmount,
		discountAmount,
		grandTotal,
	}
}
