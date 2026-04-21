<script setup lang="ts">
useHead({ title: 'New Invoice - Invoice by Nii Aryeh' })

definePageMeta({
	keepalive: true,
	middleware: [requireEmail],
})

const {
	invoice,
	reset,
	addItem,
	removeItem,
	recalcSubtotal,
	subtotal,
	taxAmount,
	discountAmount,
	grandTotal,
} = useInvoice()

const { fileUrl, onFileChange, removeFile } = useLogoUpload()
const { saveInvoice } = useInvoices()

const handleGenerate = (): void => {
	saveInvoice(invoice.value)
	navigateTo(`/dashboard/${invoice.value.invoiceNumber}/download`)
}
</script>

<template lang="pug">
section#body-outlet(class="bg-neutral-200 px-6 lg:px-12 py-8 pb-16 lg:py-20")
	div(class="grid grid-cols-3 gap-6 items-start")
		div(class="bg-white col-span-full p-4 rounded-md")
			div(class="flex pb-6 justify-between items-center")
				.form-title(class="capitalize tracking-tight text-lg") Invoice Details
				div(class="lg:flex items-center justify-center space-x-2 hidden")
					svg-cloud-off(class="text-zinc-500 text-xl")
					p(class="text-center text-zinc-500 text-sm") Your data is saved offline in your browser
				button(@click="reset" class="bg-red-500 h-9 text-sm px-4 text-white hover:bg-red-400") Clear Input Fields
			div(class="flex flex-wrap")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="invoice-number") Invoice Number
					input(type="text" id="invoice-number" name="invoice-number" required v-model="invoice.invoiceNumber" placeholder="Invoice Number")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="currency") Currency
					input(type="text" id="currency" name="currency" required v-model="invoice.currency" placeholder="Currency")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="issue-date") Issue Date
					input(type="date" id="issue-date" name="issue-date" required v-model="invoice.issueDate" placeholder="Issue Date")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="due-date") Due Date
					input(type="date" id="due-date" name="due-date" required v-model="invoice.dueDate" placeholder="Due Date")
		div(class="bg-white col-span-full p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-6") From (Your Details)
			div(class="flex flex-wrap")
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="company-name") Company Name
					input(type="text" id="company-name" name="company-name" required v-model="invoice.from.company" placeholder="Your Company")
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="company-logo") Company Logo
					input(v-if="!fileUrl" type="file" id="company-logo" name="company-logo" @change="onFileChange")
					div(v-else)
						img(:src="fileUrl" alt="Company Logo" class="size-24 object-cover rounded-md")
						button(@click="removeFile" class="text-sm text-red-500") Remove Logo
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="company-address") Company Address
					input(type="text" id="company-address-1" name="company-address-1" required placeholder="Address No 1" v-model="invoice.from.address[0]")
					input(type="text" id="company-address-2" name="company-address-2" placeholder="Address No 2" v-model="invoice.from.address[1]")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="company-email") Company Email
					input(type="text" id="company-email" name="company-email" placeholder="Your Email" v-model="invoice.from.email")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="company-tel") Company Phone
					input(type="text" id="company-tel" name="company-tel" placeholder="Your Phone" v-model="invoice.from.phone")
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="company-web") Company Website
					input(type="text" id="company-web" name="company-web" placeholder="Your Website" v-model="invoice.from.website")
		div(class="bg-white col-span-full p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-6") To (Client's Details)
			div(class="flex flex-wrap")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="client-name") Company Name / Client Name
					input(type="text" id="client-name" name="client-name" required v-model="invoice.to.company" placeholder="Client Name")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="contact-person") Contact Person
					input(type="text" id="contact-person" name="contact-person" required v-model="invoice.to.contactPerson" placeholder="Contact Person")
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="client-address") Client Address
					input(type="text" id="client-address-1" name="client-address-1" required placeholder="Address No 1" v-model="invoice.to.address[0]")
					input(type="text" id="client-address-2" name="client-address-2" placeholder="Address No 2" v-model="invoice.to.address[1]")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="client-email") Client Email
					input(type="text" id="client-email" name="client-email" required v-model="invoice.to.email" placeholder="Client Email")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="client-tel") Client Phone
					input(type="text" id="client-tel" name="client-tel" required v-model="invoice.to.phone" placeholder="Client Phone")
		div(class="bg-white col-span-full p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-6") Items
			div(v-for="(item, idx) in invoice.items" :key="idx" class="flex flex-wrap items-end")
				.input-group(:class="['space-y-2 p-2 max-lg:px-0', {'w-full lg:w-5/12': invoice.items.length > 1}, {'w-full lg:w-6/12': invoice.items.length === 1}]")
					label(for="product") Product / Service
					input(type="text" id="product" name="product" required placeholder="Item Description" v-model="item.product")
				.input-group(class="space-y-2 w-full lg:w-2/12 p-2 max-lg:px-0")
					label(for="quantity") Quantity
					input(type="number" id="quantity" name="quantity" required placeholder="0" v-model="item.quantity" @input="recalcSubtotal(idx)")
				.input-group(class="space-y-2 w-full lg:w-2/12 p-2 max-lg:px-0")
					label(for="unit") Unit Price
					input(type="number" id="unit" name="unit" required placeholder="0" v-model="item.unit" @input="recalcSubtotal(idx)")
				.input-group(class="space-y-2 w-full lg:w-2/12 p-2 max-lg:px-0")
					label(for="cost") Cost
					input(type="text" id="cost" name="cost" disabled readonly :value="`${invoice.currency} ${item.subtotal}`")
				.delete-group(v-if="invoice.items.length > 1" class="w-full lg:w-1/12 p-2 max-lg:px-0 cursor-pointer")
					button(class="w-full text-sm bg-red-500 hover:bg-red-600 text-white text-center rounded-md p-2" @click="removeItem(idx)") Delete
			.button(class="mt-4")
				button(type="button" class="border border-zinc-500 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="addItem") Add Item
		div(class="bg-white col-span-full lg:col-span-1 p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-6") Taxes & Discounts
			div(class="flex flex-wrap")
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="tax") Tax
					div(class="flex items-center")
						input(type="number" id="tax" name="tax" required v-model="invoice.tax" placeholder="Tax")
						span(class="ml-2") %
				.input-group(class="space-y-2 w-full lg:w-1/2 p-2 max-lg:px-0")
					label(for="discount") Discount
					div(class="flex items-center")
						input(type="number" id="discount" name="discount" required v-model="invoice.discount" placeholder="Discount")
						span(class="ml-2") %
		div(class="bg-white col-span-full lg:col-span-1 p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-6") Payment Terms
			div(class="flex flex-wrap")
				.input-group(class="space-y-2 w-full p-2 max-lg:px-0")
					label(for="payment-terms") Payment Terms
					textarea(id="payment-terms" name="payment-terms" rows="5" v-model="invoice.paymentTerms" placeholder="Payment Terms")
		div(class="bg-white col-span-full lg:col-span-1 p-4 rounded-md")
			.form-title(class="capitalize tracking-tight text-lg pb-4") Total
			.total(class="space-y-2")
				div(class="text-neutral-600") Subtotal: {{ invoice.currency }} {{ subtotal.toLocaleString() }}.00
				div(v-if="invoice.tax" class="text-sm text-neutral-500") Tax ({{ invoice.tax }}%): {{ taxAmount.toLocaleString() }}.00
				div(v-if="invoice.discount" class="text-sm text-neutral-500") Discount ({{ invoice.discount }}%): {{ discountAmount.toLocaleString() }}.00
				div(class="text-xl") Grand Total: {{ invoice.currency }} {{ grandTotal.toLocaleString() }}.00
			button(@click="handleGenerate" class="bg-neutral-800 h-9 text-sm w-full text-white hover:bg-neutral-700 mt-4") Generate Invoice
		div(class="col-span-full lg:col-span-1 lg:col-start-3")
</template>
