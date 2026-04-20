<script lang="ts" setup>
import type { Invoice, InvoiceFormat } from '~~/shared/types/invoice'

interface Props {
	invoice: Invoice
	format: InvoiceFormat
	logo: string
	subtotal: number
	taxAmount: number
	discountAmount: number
	grandTotal: number
}

defineProps<Props>()

const inv = ref<HTMLElement | null>(null)

defineExpose({ inv })
</script>

<template lang="pug">
#invoice(ref="inv" class="relative w-[8.5in] h-[11in] bg-white mx-auto !font-custom")
	header(class="py-8 px-12 space-y-4" :style="{backgroundColor: format.headerBgColor, color: format.headerTextColor}")
		div(class="flex pb-6")
			div(class="flex space-x-4")
				.logo(v-if="logo" class="size-24 pointer-events-none")
					img(:src="logo" class="w-full h-full object-contain object-center" crossOrigin="anonymous")
				.from
					h2(class="font-semibold") {{ invoice.from.company }}
					p {{ invoice.from.email }}
					p {{ invoice.from.phone }}
					p {{ invoice.from.address[0] }}
					p {{ invoice.from.address[1] }}
					p {{ invoice.from.website }}
			.to(class="ms-auto")
				h2(class="font-semibold") {{ invoice.to.company }}
				p {{ invoice.to.contactPerson }}
				p {{ invoice.to.email }}
				p {{ invoice.to.phone }}
				p {{ invoice.to.address[0] }}
				p {{ invoice.to.address[1] }}
		div(class="flex")
			.invoice-number
				h2(class="text-2xl font-light pb-2") {{ invoice.invoiceNumber }}
				.invoice-details
					p Invoice Reference: {{ invoice.invoiceNumber }}
					p Invoice Date: {{ $dayjs(invoice.issueDate).format('D/MM/YY') }}
					p(class="font-semibold") Due Date: {{ $dayjs(invoice.dueDate).format('D/MM/YY') }}
			.date(class="ms-auto text-right me-4")
				p(class="uppercase text-sm font-semibold") Total Due
				h1(class="text-2xl font-black tracking-tight") {{ invoice.currency }}{{ grandTotal.toLocaleString() }}.00

	.invoice-body(class="py-4 px-12")
		.body-header(class="grid grid-cols-5 gap-4 text-neutral-600 p-4 pb-2 border-b-2 border-neutral-300")
			div(class="col-span-1 text-center") Quantity
			div(class="col-span-2") Item/Description
			div(class="col-span-1 text-center") Unit Price
			div(class="col-span-1 text-center ps-6") Cost
		div(class="space-y-8 py-6")
			.body-content(v-for="(item, idx) in invoice.items" :key="idx" class="grid grid-cols-5 gap-4 text-neutral-600 px-4 ")
				div(class="col-span-1 text-center") {{ item.quantity }}
				div(class="col-span-2 font-semibold tracking-tight") {{ item.product }}
				div(class="col-span-1 text-center") {{ invoice.currency }}{{ item.unit.toLocaleString() }}.00
				div(class="col-span-1 text-right font-semibold") {{ invoice.currency }}{{ item.subtotal.toLocaleString() }}.00
		.body-footer(class="flex text-neutral-600")
			.payment-terms(v-if="invoice.paymentTerms" class="w-1/2")
				p(class="font-bold") Payment Terms
				p(class="!text-neutral-600 whitespace-pre-wrap") {{ invoice.paymentTerms }}
			.total-box(class="ms-auto w-5/12")
				.subtotal(class="flex border-y-2 p-4 border-y-neutral-400")
					div
						p(class="uppercase text-center font-semibold") Subtotal
						div(class="text-xs pt-2 space-y-1" v-if="invoice.tax || invoice.discount")
							p(v-if="invoice.tax") Tax ({{ invoice.tax }}%)
							p(v-if="invoice.discount") Discount ({{ invoice.discount }}%)
					div(class="ms-auto")
						p(class="font-semibold") {{ invoice.currency }}{{ subtotal.toLocaleString() }}.00
						div(class="text-xs pt-2 space-y-1" v-if="invoice.tax || invoice.discount")
							p(v-if="invoice.tax") {{ invoice.currency }}{{ taxAmount.toLocaleString() }}.00
							p(v-if="invoice.discount") ({{ invoice.currency }}{{ discountAmount.toLocaleString() }}.00)
				.total(class="flex px-4 pt-4")
					div
						p(class="uppercase text-center font-black") Grand Total
					div(class="ms-auto")
						p(class="text-center font-black") {{ invoice.currency }}{{ grandTotal.toLocaleString() }}.00
</template>
