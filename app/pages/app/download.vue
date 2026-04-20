<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import DefaultTemplate from '~/components/templates/Default.vue'
import ClassicTemplate from '~/components/templates/Classic.vue'
import BubblegumTemplate from '~/components/templates/Bubblegum.vue'

useHead({ title: 'Download - Invoice by Nii Aryeh' })

definePageMeta({
	middleware: [requireEmail],
})

const email = useEmail()
const logo = useState<string>('logo', () => '')

const { invoice, subtotal, taxAmount, discountAmount, grandTotal } = useInvoice()
const { format, resetColors } = useInvoiceFormat()

const showSettings = ref(false)
const toggleSettings = (): void => {
	showSettings.value = !showSettings.value
}

const invoiceRef = ref<{ inv: HTMLElement | null } | null>(null)
const width = ref(0)
const height = ref(0)

onNuxtReady(() => {
	const element = invoiceRef.value?.inv
	if (!element) return
	const { width: w, height: h } = useElementSize(element)
	width.value = w.value
	height.value = h.value
})

const { isDownloading, isSending, downloadPdf, sendToEmail } = useInvoiceExport({
	invoice,
	target: invoiceRef,
	width,
	height,
})

const handleSendToEmail = async (): Promise<void> => {
	try {
		await sendToEmail(email.value)
	} catch (error) {
		console.error('Failed to send invoice email', error)
	}
}
</script>

<template lang="pug">
section#body-outlet
	div(class="flex")
		div(:class="['bg-neutral-200 h-screen p-6 lg:w-2/3 overflow-auto', {'!w-full': !showSettings}]")
			svg-slider(v-if="!showSettings" class="absolute top-5 right-4 text-neutral-800 text-lg cursor-pointer" @click="toggleSettings")
			.buttons(class="space-x-4 pb-6 flex justify-center")
				button(v-if="!isDownloading" @click="downloadPdf" class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700") Download PDF
				button(v-else class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700")
					svg-spinner(class="mx-auto")
				button(v-if="!isSending" @click="handleSendToEmail" class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700") Send to Email
				button(v-else class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700")
					svg-spinner(class="mx-auto")
				button(@click="$router.go(-1)" class="bg-white h-9 text-sm px-4 text-black hover:bg-neutral-100") Edit PDF
			DefaultTemplate(v-if="format.template === 'Default'" ref="invoiceRef" :invoice="invoice" :format="format" :logo="logo" :subtotal="subtotal" :taxAmount="taxAmount" :discountAmount="discountAmount" :grandTotal="grandTotal")
			ClassicTemplate(v-else-if="format.template === 'Classic'" ref="invoiceRef" :invoice="invoice" :format="format" :logo="logo" :subtotal="subtotal" :taxAmount="taxAmount" :discountAmount="discountAmount" :grandTotal="grandTotal")
			BubblegumTemplate(v-else-if="format.template === 'Bubblegum'" ref="invoiceRef" :invoice="invoice" :format="format" :logo="logo" :subtotal="subtotal" :taxAmount="taxAmount" :discountAmount="discountAmount" :grandTotal="grandTotal")
		div(v-if="showSettings" class="show-settings max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-40 bg-white h-screen p-6 w-full lg:w-1/3 overflow-auto")
			header(class="flex items-center justify-end space-x-4")
				svg-close(class="text-2xl text-red-500 hover:text-red-600 cursor-pointer" @click="toggleSettings")
			.settings-sections(class="space-y-12 *:border-b *:border-zinc-300 *:pb-8 last:border-b-0")
				div(v-if="format.template === 'Default'")
					div(class="flex items-center pb-6 space-x-2")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Formatting
						.reset(class="text-xs text-red-500 cursor-pointer" @click="resetColors") Reset
					.format-settings(class="text-sm tracking-tight space-y-2")
						div(class="flex items-center")
							p Header Background Color
							input(type="color" class="w-12 ms-auto p-0 border-none rounded-none" v-model="format.headerBgColor")
						div(class="flex items-center")
							p Header Text Color
							input(type="color" class="w-12 ms-auto p-0 border-none rounded-none" v-model="format.headerTextColor")
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Templates
					select(class="block w-full p-2 bg-white text-neutral-800" v-model="format.template")
						option(disabled value="") Select Theme
						option(value="Default") Default
						option(value="Classic") Classic
						option(value="Bubblegum") Bubblegum
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Information
					div(class="text-sm tracking-tight space-y-4")
						h6(class="font-medium") Found a bug, or have an idea for a new feature?
						p If you have an idea that would help you and other users in creating your resume more easily send me an email about it.
						button(class="bg-neutral-800 h-9 text-sm w-full text-white hover:bg-neutral-700" @click="navigateTo('mailto:sup@niiaryeh.com', {external: true})") Send Me an Email
</template>
