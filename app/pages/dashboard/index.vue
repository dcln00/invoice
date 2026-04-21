<script setup lang="ts">
useHead({ title: 'Dashboard - Invoice by Nii Aryeh' })

definePageMeta({
	middleware: [requireEmail],
})

const { invoices, deleteInvoice, nextInvoiceNumber } = useInvoices()
const { reset, invoice } = useInvoice()

const handleNew = (): void => {
	reset()
	invoice.value.invoiceNumber = nextInvoiceNumber.value
	navigateTo('/new')
}
</script>

<template lang="pug">
section(class="min-h-screen bg-neutral-200 px-6 lg:px-12 py-8 lg:py-20")
	div(class="max-w-5xl/ mx-auto")
		header(class="flex items-center justify-between pb-8")
			h1(class="text-2xl tracking-tight font-light")
				span(class="text-brand-accent") in
				span(class="text-brand-black") voice
			button(@click="handleNew" class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700") + New Invoice

		div(v-if="invoices.length === 0" class="bg-white rounded-md p-12 text-center space-y-4")
			p(class="text-zinc-500 tracking-tight") No invoices yet
			button(@click="handleNew" class="bg-neutral-800 h-9 text-sm px-6 text-white hover:bg-neutral-700") Create your first invoice

		div(v-else class="bg-white rounded-md overflow-hidden")
			table(class="w-full text-sm")
				thead
					tr(class="border-b border-zinc-200 text-zinc-500 text-left")
						th(class="p-4 font-medium") Invoice #
						th(class="p-4 font-medium") Client
						th(class="p-4 font-medium") Issue Date
						th(class="p-4 font-medium text-right") Amount
						th(class="p-4 font-medium")
				tbody
					tr(
						v-for="inv in invoices"
						:key="inv.invoiceNumber"
						class="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
					)
						td(class="p-4 font-medium tracking-tight") {{ inv.invoiceNumber }}
						td(class="p-4 text-zinc-600") {{ inv.to.company || inv.to.contactPerson || '—' }}
						td(class="p-4 text-zinc-500") {{ inv.issueDate }}
						td(class="p-4 text-right")
							span(class="font-medium") {{ inv.currency }} {{ inv.items.reduce((s, i) => s + i.subtotal, 0).toLocaleString() }}.00
						td(class="p-4")
							div(class="flex items-center justify-end space-x-2")
								NuxtLink(
									:to="`/dashboard/${inv.invoiceNumber}/download`"
									class="bg-neutral-800 h-8 text-xs px-3 text-white hover:bg-neutral-700 inline-flex items-center"
								) View
								button(
									@click="deleteInvoice(inv.invoiceNumber)"
									class="h-8 text-xs px-3 border border-red-300 text-red-500 hover:bg-red-50"
								) Delete
</template>
