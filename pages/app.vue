<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const input = useStorage('invoice', {
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
	items: [
		{
			product: '',
			quantity: 0,
			unit: 0,
			subtotal: 0,
		},
	],
})

input.value.issueDate = getTodayDate()
input.value.dueDate = getDueDate()

function getDueDate() {
	const date = new Date()
	date.setDate(date.getDate() + 30)
	return date.toISOString().split('T')[0]
}

function getTodayDate() {
	return new Date().toISOString().split('T')[0]
}

const handleClearInput = () => {
	input.value = {
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
		items: [
			{
				product: '',
				quantity: 0,
				unit: 0,
				subtotal: 0,
			},
		],
	}
}

const handleAddItem = () => {
	input.value.items.push({
		product: '',
		quantity: 0,
		unit: 0,
		subtotal: 0,
	})
}

const handleRemoveItem = (index: number) => {
	input.value.items.splice(index, 1)
}

const handleSubtotal = (index: number) => {
	const item = input.value.items[index]
	item.subtotal = item.quantity * item.unit
}

const handleTotal = () => {
	return input.value.items.reduce((acc, item) => acc + item.subtotal, 0)
}

const handleTotalAfterTax = () => {
	const total = input.value.items.reduce((acc, item) => acc + item.subtotal, 0)
	const tax = total * (input.value.tax / 100)
	const discount = total * (input.value.discount / 100)
	return total + tax - discount
}

const tax = computed(() => handleTotal() * (input.value.tax / 100))
const discount = computed(() => handleTotal() * (input.value.discount / 100))
</script>

<template lang="pug">
NuxtPage(:input="input" :handleAddItem="handleAddItem" :handleRemoveItem="handleRemoveItem" :handleSubtotal="handleSubtotal" :handleTotal="handleTotal" :handleTotalAfterTax="handleTotalAfterTax" :tax="tax" :discount="discount" @handleReset="handleClearInput")
</template>
