<script lang="ts" setup>
defineProps(['input', 'handleTotal', 'handleTotalAfterTax', 'tax', 'discount', 'logo', 'formatting'])

const inv = ref(null)

defineExpose({
	inv
})
</script>

<template lang="pug">
#invoice(ref="inv" class="relative w-[8.5in] h-[11in] bg-white mx-auto")
	header(class="py-8 mx-12 space-y-4 bg-white border-b-2 border-b-black")
		div(class="flex pb-8")
			div(class="flex space-x-4")
				.logo(v-if="logo" class="size-32 pointer-events-none")
					img(:src="logo" class="w-full h-full object-contain object-center")
				.from
					h2(class="font-semibold") {{ input.from.company }}
					p {{ input.from.email }}
					p {{ input.from.phone }}
					p {{ input.from.address[0] }}
					p {{ input.from.address[1] }}
					p {{ input.from.website }}
			.heading(class="ms-auto")
				h1(class="uppercase text-6xl font-extralight") Invoice
		div(class="flex")
			.to
				p(class="uppercase font-medium") Billed To:
				h2(class="font-semibold") {{ input.to.company }}
				p {{ input.to.contactPerson}}
				p {{ input.to.email }}
				p {{ input.to.phone }}
				p {{ input.to.address[0] }}
				p {{ input.to.address[1] }}
			.invoice-number(class="ms-auto text-right")
				h2(class="text-2xl font-light pb-2") {{ input.invoiceNumber }}
				.invoice-details
					p Invoice Reference: {{ input.invoiceNumber }}
					p Invoice Date: {{ $dayjs(input.issueDate).format('D MMMM YYYY') }}
					p(class="font-semibold") Due Date: {{ $dayjs(input.dueDate).format('D MMMM YYYY') }}
	.invoice-body(class="px-12")
		.body-header(class="grid grid-cols-5 gap-4 text-black p-4 py-4 border-b-2 border-black")
			div(class="col-span-2") Item/Description
			div(class="col-span-1 text-center") Quantity
			div(class="col-span-1 text-center") Unit Price
			div(class="col-span-1 text-center ps-6") Cost
		.body-content(v-for="(item, idx) in input.items" :key="idx" class="grid grid-cols-5 gap-4 text-black p-4 py-6 border-b-2 border-black")
			div(class="col-span-2 font-semibold tracking-tight") {{ item.product }}
			div(class="col-span-1 text-center") {{ item.quantity }}
			div(class="col-span-1 text-center") {{ input.currency }}{{ item.unit.toLocaleString() }}.00
			div(class="col-span-1 text-right font-semibold") {{ input.currency }}{{ item.subtotal.toLocaleString() }}.00
		.body-footer(class="flex text-black")
			.payment-terms(v-if="input.paymentTerms" class="w-1/2 pt-4")
				p(class="font-bold") Payment Terms
				div(v-html="input.paymentTerms")
			.total-box(class="ms-auto w-5/12")
				.subtotal(class="flex border-b-2 p-4 border-b-black")
					div
						p(class="uppercase text-center font-semibold") Subtotal
						div(class="text-xs pt-2 space-y-1")
							p(v-if="input.tax") Tax ({{ input.tax }}%)
							p(v-if="input.discount") Discount ({{ input.discount }}%)
					div(class="ms-auto")
						p(class="font-semibold") {{ input.currency }}{{ handleTotal().toLocaleString() }}.00
						div(class="text-xs pt-2 space-y-1")
							p(v-if="input.tax") {{ input.currency }}{{ tax.toLocaleString() }}.00
							p(v-if="input.discount") ({{ input.currency }}{{ discount.toLocaleString() }}.00)
				.total(class="flex px-4 pt-4")
					div
						p(class="uppercase text-center font-black") Grand Total
					div(class="ms-auto")
						p(class="text-center font-black") {{ input.currency }}{{ handleTotalAfterTax().toLocaleString() }}.00
</template>