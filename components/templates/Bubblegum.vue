<script lang="ts" setup>
defineProps(['input', 'handleTotal', 'handleTotalAfterTax', 'tax', 'discount', 'logo', 'formatting'])

const inv = ref(null)

defineExpose({
	inv
})
</script>

<template lang="pug">
#invoice(ref="inv" class="relative w-[8.5in] h-[11in] bg-white mx-auto")
	header(class="py-8 px-12 space-y-4 bg-white")
		div(class="flex pb-6")
			.invoice-number
				h1(class="uppercase text-3xl font-light tracking-wider pb-6 text-neutral-400 !font-custom") Invoice
				.invoice-details(class="font-mono text-neutral-600")
					p Invoice Number: {{ input.invoiceNumber }}
					p Date Issued: {{ $dayjs(input.issueDate).format('D MMMM YYYY') }}
					p(class="font-semibold") Date Due: {{ $dayjs(input.dueDate).format('D MMMM YYYY') }}
		div(class="flex font-mono text-neutral-600")
			div(class="flex space-x-4")
				.logo(v-if="logo" class="size-24 pointer-events-none")
					img(:src="logo" class="w-full h-full object-contain object-center")
				.from
					h2(class="font-semibold") {{ input.from.company }}
					p {{ input.from.email }}
					p {{ input.from.phone }}
					p {{ input.from.address[0] }}
					p {{ input.from.address[1] }}
					p {{ input.from.website }}
			.to(class="ms-auto")
				h2(class="font-semibold capitalize") issued to:
				h2(class="font") {{ input.to.company }}
				p {{ input.to.contactPerson}}
				p {{ input.to.email }}
				p {{ input.to.phone }}
				p {{ input.to.address[0] }}
				p {{ input.to.address[1] }}
	
	.invoice-body(class="py-4 px-12")
		.body-header(class="grid grid-cols-5 gap-4 text-neutral-600  px-4 border border-neutral-300 bg-[#e1d4ce] uppercase text-sm")
			div(class="col-span-1 py-3 text-center border-e border-neutral-400") Quantity
			div(class="col-span-2 py-3 border-e border-neutral-400") Item/Description
			div(class="col-span-1 py-3 text-center border-e border-neutral-400") Unit Price
			div(class="col-span-1 py-3 text-center ps-6") Cost
		div(class="font-mono border-x border-neutral-300")
			.body-content(v-for="(item, idx) in input.items" :key="idx" class="grid grid-cols-5 gap-4 text-neutral-600 px-4")
				div(class="col-span-1 py-4 text-center border-e border-neutral-300") {{ item.quantity }}
				div(class="col-span-2 py-4 font-medium tracking-tight border-e border-neutral-300") {{ item.product }}
				div(class="col-span-1 py-4 text-center border-e border-neutral-300") {{ input.currency }}{{ item.unit.toLocaleString() }}.00
				div(class="col-span-1 py-4 text-right font-semibold") {{ input.currency }}{{ item.subtotal.toLocaleString() }}.00
		.body-footer
			.subtotal(class="grid grid-cols-5 gap-4 px-4 bg-neutral-200")
				div(class="col-span-4 text-right p-4 py-3 uppercase text-sm text-neutral-600 border-e border-neutral-300 ")
					p Subtotal
					div(class="text-xs pt-2 space-y-1" v-if="input.tax || input.discount")
						p(v-if="input.tax") Tax ({{ input.tax }}%)
						p(v-if="input.discount") Discount ({{ input.discount }}%)
				div(class="col-span-1 text-right py-3 uppercase text-sm text-neutral-600 font-mono")
					p {{ input.currency }}{{ handleTotal().toLocaleString() }}.00
					div(class="text-xs pt-2 space-y-1" v-if="input.tax || input.discount")
						p(v-if="input.tax") {{ input.currency }}{{ tax.toLocaleString() }}.00
						p(v-if="input.discount") ({{ input.currency }}{{ discount.toLocaleString() }}.00)
			.total(class="grid grid-cols-5 gap-4 px-4 bg-neutral-400")
				.div(class="col-span-4 text-right text-white p-4 py-3 uppercase text-sm border-e border-white") Total
				.div(class="col-span-1 text-right text-white py-3 uppercase text-sm font-mono") {{ input.currency }}{{ handleTotalAfterTax().toLocaleString() }}.00
			.payment-terms(v-if="input.paymentTerms" class="w-1/2 mt-6 font-mono text-neutral-600")
				p(class="font-bold") Payment Terms
				div(v-html="input.paymentTerms")

		//- .body-footer(class="flex text-neutral-600 font-mono")
			.payment-terms(v-if="input.paymentTerms" class="w-1/2")
				p(class="font-bold") Payment Terms
				div(v-html="input.paymentTerms")
			.total-box(class="ms-auto w-5/12")
				.subtotal(class="flex border-y-2 p-4 border-y-neutral-400")
					div
						p(class="uppercase text-center font-semibold") Subtotal
						div(class="text-xs pt-2 space-y-1" v-if="input.tax || input.discount")
							p(v-if="input.tax") Tax ({{ input.tax }}%)
							p(v-if="input.discount") Discount ({{ input.discount }}%)
					div(class="ms-auto")
						p(class="font-semibold") {{ input.currency }}{{ handleTotal().toLocaleString() }}.00
						div(class="text-xs pt-2 space-y-1" v-if="input.tax || input.discount")
							p(v-if="input.tax") {{ input.currency }}{{ tax.toLocaleString() }}.00
							p(v-if="input.discount") ({{ input.currency }}{{ discount.toLocaleString() }}.00)
				.total(class="flex px-4 pt-4")
					div
						p(class="uppercase text-center font-black") Grand Total
					div(class="ms-auto")
						p(class="text-center font-black") {{ input.currency }}{{ handleTotalAfterTax().toLocaleString() }}.00
</template>