import { useStorage } from '@vueuse/core'
import type { InvoiceFormat } from '~~/shared/types/invoice'

const STORAGE_KEY = 'invoice-format'

const DEFAULT_FORMAT: InvoiceFormat = {
	headerBgColor: '#262626',
	headerTextColor: '#ffffff',
	template: 'Default',
}

export const useInvoiceFormat = () => {
	const format = useStorage<InvoiceFormat>(STORAGE_KEY, { ...DEFAULT_FORMAT }, undefined, {
		mergeDefaults: true,
	})

	const resetColors = (): void => {
		format.value.headerBgColor = DEFAULT_FORMAT.headerBgColor
		format.value.headerTextColor = DEFAULT_FORMAT.headerTextColor
	}

	return { format, resetColors }
}
