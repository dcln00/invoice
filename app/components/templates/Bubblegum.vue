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
#invoice(ref="inv" class="relative w-[8.5in] h-[11in] bg-white mx-auto")
	header(class="py-8 px-12 space-y-4 bg-white")
		div(class="flex pb-6")
			.invoice-number
				h1(class="uppercase text-3xl font-light tracking-wider pb-6 text-neutral-400 !font-custom") Invoice
				.invoice-details(class="font-mono text-neutral-600")
					p Invoice Number: {{ invoice.invoiceNumber }}
					p Date Issued: {{ $dayjs(invoice.issueDate).format('D MMMM YYYY') }}
					p(class="font-semibold") Date Due: {{ $dayjs(invoice.dueDate).format('D MMMM YYYY') }}
		div(class="flex font-mono text-neutral-600")
			div(class="flex space-x-4")
				.logo(v-if="logo" class="size-24 pointer-events-none")
					img(:src="logo" class="w-full h-full object-contain object-center")
				.from
					h2(class="font-semibold") {{ invoice.from.company }}
					p {{ invoice.from.email }}
					p {{ invoice.from.phone }}
					p {{ invoice.from.address[0] }}
					p {{ invoice.from.address[1] }}
					p {{ invoice.from.website }}
			.to(class="ms-auto")
				h2(class="font-semibold capitalize") issued to:
				h2(class="font") {{ invoice.to.company }}
				p {{ invoice.to.contactPerson }}
				p {{ invoice.to.email }}
				p {{ invoice.to.phone }}
				p {{ invoice.to.address[0] }}
				p {{ invoice.to.address[1] }}

	.invoice-body(class="py-4 px-12")
		.body-header(class="grid grid-cols-5 gap-4 text-neutral-600 px-4 border border-neutral-300 bg-[#e1d4ce] uppercase text-sm")
			div(class="col-span-1 py-3 text-center border-e border-neutral-400") Quantity
			div(class="col-span-2 py-3 border-e border-neutral-400") Item/Description
			div(class="col-span-1 py-3 text-center border-e border-neutral-400") Unit Price
			div(class="col-span-1 py-3 text-center ps-6") Cost
		div(class="font-mono border-x border-neutral-300")
			.body-content(v-for="(item, idx) in invoice.items" :key="idx" class="grid grid-cols-5 gap-4 text-neutral-600 px-4")
				div(class="col-span-1 py-4 text-center border-e border-neutral-300") {{ item.quantity }}
				div(class="col-span-2 py-4 font-medium tracking-tight border-e border-neutral-300") {{ item.product }}
				div(class="col-span-1 py-4 text-center border-e border-neutral-300") {{ invoice.currency }}{{ item.unit.toLocaleString() }}.00
				div(class="col-span-1 py-4 text-right font-semibold") {{ invoice.currency }}{{ item.subtotal.toLocaleString() }}.00
		.body-footer
			.subtotal(class="grid grid-cols-5 gap-4 px-4 bg-neutral-200")
				div(class="col-span-4 text-right p-4 py-3 uppercase text-sm text-neutral-600 border-e border-neutral-300")
					p Subtotal
					div(class="text-xs pt-2 space-y-1" v-if="invoice.tax || invoice.discount")
						p(v-if="invoice.tax") Tax ({{ invoice.tax }}%)
						p(v-if="invoice.discount") Discount ({{ invoice.discount }}%)
				div(class="col-span-1 text-right py-3 uppercase text-sm text-neutral-600 font-mono")
					p {{ invoice.currency }}{{ subtotal.toLocaleString() }}.00
					div(class="text-xs pt-2 space-y-1" v-if="invoice.tax || invoice.discount")
						p(v-if="invoice.tax") {{ invoice.currency }}{{ taxAmount.toLocaleString() }}.00
						p(v-if="invoice.discount") ({{ invoice.currency }}{{ discountAmount.toLocaleString() }}.00)
			.total(class="grid grid-cols-5 gap-4 px-4 bg-neutral-400")
				.div(class="col-span-4 text-right text-white p-4 py-3 uppercase text-sm border-e border-white") Total
				.div(class="col-span-1 text-right text-white py-3 uppercase text-sm font-mono") {{ invoice.currency }}{{ grandTotal.toLocaleString() }}.00
			.payment-terms(v-if="invoice.paymentTerms" class="w-1/2 mt-6 font-mono text-neutral-600")
				p(class="font-bold") Payment Terms
				p(class="whitespace-pre-wrap") {{ invoice.paymentTerms }}
</template>
