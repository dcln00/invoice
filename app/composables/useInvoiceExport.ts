import type { Ref } from 'vue'
import type { Invoice } from '~~/shared/types/invoice'

interface ExportTarget {
	inv: HTMLElement | null
}

interface UseInvoiceExportOptions {
	invoice: Ref<Invoice>
	target: Ref<ExportTarget | null>
	width: Ref<number>
	height: Ref<number>
}

const SCREENSHOT_SCALE = 3
const DRAW_IMAGE_INTERVAL_MS = 1_000

export const useInvoiceExport = ({ invoice, target, width, height }: UseInvoiceExportOptions) => {
	const { $screenshot, $pdf } = useNuxtApp()
	const { ensureFontsLoaded } = useFontLoader()

	const isDownloading = ref(false)
	const isSending = ref(false)

	const renderPdf = async (): Promise<InstanceType<typeof $pdf> | null> => {
		const element = target.value?.inv
		if (!element) return null

		await ensureFontsLoaded()

		const screenshot = await $screenshot(element, {
			drawImageInterval: DRAW_IMAGE_INTERVAL_MS,
			scale: SCREENSHOT_SCALE,
			font: {},
			fetch: {
				requestInit: { mode: 'cors', cache: 'no-cache' },
			},
		})

		const pdf = new $pdf({
			orientation: 'p',
			unit: 'px',
			format: [width.value, height.value],
		})
		const img = pdf.getImageProperties(screenshot)
		const pdfWidth = pdf.internal.pageSize.getWidth()
		const pdfHeight = (img.height * pdfWidth) / img.width
		pdf.addImage(screenshot, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
		return pdf
	}

	const downloadPdf = async (): Promise<void> => {
		try {
			isDownloading.value = true
			const pdf = await renderPdf()
			if (!pdf) return
			pdf.save(`${invoice.value.invoiceNumber}.pdf`)
		} finally {
			isDownloading.value = false
		}
	}

	const sendToEmail = async (recipient: string): Promise<void> => {
		try {
			isSending.value = true
			const pdf = await renderPdf()
			if (!pdf) return

			const res = await $fetch('/api/mail', {
				method: 'POST',
				body: {
					to: recipient,
					subject: 'Here is your Invoice',
					file: pdf.output('datauristring'),
					filename: `${invoice.value.invoiceNumber}.pdf`,
				},
			})

			if (!res) {
				throw createError({ statusCode: 500, statusMessage: 'Error sending mail' })
			}
		} finally {
			isSending.value = false
		}
	}

	return { isDownloading, isSending, downloadPdf, sendToEmail }
}
