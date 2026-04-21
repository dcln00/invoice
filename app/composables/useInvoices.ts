import { useStorage } from '@vueuse/core'
import type { Invoice } from '~~/shared/types/invoice'

const STORAGE_KEY = 'invoices'

export const useInvoices = () => {
	const invoices = useStorage<Invoice[]>(STORAGE_KEY, [])

	const saveInvoice = (invoice: Invoice): void => {
		const idx = invoices.value.findIndex(i => i.invoiceNumber === invoice.invoiceNumber)
		if (idx >= 0) {
			invoices.value[idx] = { ...invoice }
		} else {
			invoices.value.push({ ...invoice })
		}
	}

	const getInvoice = (id: string): Invoice | undefined =>
		invoices.value.find(i => i.invoiceNumber === id)

	const deleteInvoice = (id: string): void => {
		invoices.value = invoices.value.filter(i => i.invoiceNumber !== id)
	}

	const nextInvoiceNumber = computed(() => {
		const n = invoices.value.length + 1
		return `INV-${String(n).padStart(3, '0')}`
	})

	return { invoices, saveInvoice, getInvoice, deleteInvoice, nextInvoiceNumber }
}
