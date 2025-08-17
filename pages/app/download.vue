<script setup lang="ts">
import { useElementSize, useStorage } from '@vueuse/core'
const { $screenshot, $pdf } = useNuxtApp() as any
const props = defineProps(['input', 'handleTotal', 'handleTotalAfterTax', 'tax', 'discount'])

useHead({
	title: 'Download - Resume by Nii Aryeh',
})

definePageMeta({
	middleware: [async () => {
		const email = useState('email')
		if (!email.value) return navigateTo('/')
	}]
})

const formatting = useStorage('invoice-format', {
	headerBgColor: '#262626',
	headerTextColor: '#ffffff',
	template: 'Default'
})

const handleReset = () => {
	formatting.value.headerBgColor = '#262626'
	formatting.value.headerTextColor = '#ffffff'
}

const show = ref(false)
const isSaving = ref(false)
const isDownloading = ref(false)
const screenshot = ref('')
const file = ref('')
const invoice = ref()
const width = ref(0)
const height = ref(0)
const email = useState('email')
const logo = useState('logo')

const toggleShow = () => {
	show.value = !show.value
}

onNuxtReady(async () => {
	const { width: w, height: h } = useElementSize(invoice.value.inv)
	width.value = w.value
	height.value = h.value
})

// Utility function to ensure fonts are loaded before screenshot
const ensureFontsLoaded = async () => {
	// Check if fonts are already loaded
	if (document.fonts && document.fonts.ready) {
		await document.fonts.ready
	} else {
		// Fallback for browsers that don't support document.fonts
		// Load Jost font from Google Fonts with all weights and styles
		const fontLink = document.createElement('link')
		fontLink.href = 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap'
		fontLink.rel = 'stylesheet'
		document.head.appendChild(fontLink)
		
		// Wait for fonts to load
		await new Promise((resolve) => {
			if (document.fonts) {
				document.fonts.ready.then(resolve)
			} else {
				// Fallback timeout for older browsers
				setTimeout(resolve, 2000)
			}
		})
	}
	
	// Additional wait to ensure fonts are fully rendered
	// This is especially important for Safari
	await new Promise(resolve => setTimeout(resolve, 1000))
	
	// Force a repaint to ensure fonts are applied
	if (invoice.value && invoice.value.inv) {
		invoice.value.inv.style.display = 'none'
		invoice.value.inv.offsetHeight // Force reflow
		invoice.value.inv.style.display = ''
	}
	
	// Additional check to ensure Jost font is loaded
	if (document.fonts) {
		// Test if Jost font is loaded by checking a specific weight
		const testElement = document.createElement('span')
		testElement.style.fontFamily = 'Jost, sans-serif'
		testElement.style.fontWeight = '400'
		testElement.style.visibility = 'hidden'
		testElement.textContent = 'Test'
		document.body.appendChild(testElement)
		
		// Wait for the font to be loaded
		await document.fonts.load('400 16px Jost')
		
		document.body.removeChild(testElement)
	}
}

const DownloadPDF = async () => {
	try {
		isDownloading.value = true

		if(invoice.value.inv) {
			// Ensure fonts are loaded before taking screenshot
			await ensureFontsLoaded()

			const canvas = await $screenshot(invoice.value.inv, {
				drawImageInterval: 1000,
				scale: 3,
				fetch: {
					requestInit: {
						mode: 'cors',
						cache: 'no-cache',
					}
				}
			})
			screenshot.value = canvas
			const pdf = new $pdf({
				orientation: "p",
				unit: "px",
				format: [width.value, height.value]
			})
			const img = pdf.getImageProperties(screenshot.value)
			const pdfw = pdf.internal.pageSize.getWidth()
			const pdfh = (img.height * pdfw) / img.width
			pdf.addImage(screenshot.value, 'PNG', 0, 0, pdfw, pdfh, undefined, 'FAST')
			pdf.save(`${props.input.invoiceNumber}.pdf`)
		}

	} finally {
		isDownloading.value = false
	}
}

const sendToEmail = async () => {
	try {
		isSaving.value = true

		if(invoice.value.inv) {
			// Ensure fonts are loaded before taking screenshot
			await ensureFontsLoaded()

			const canvas = await $screenshot(invoice.value.inv, {
				drawImageInterval: 1000,
				scale: 3,
				fetch: {
					requestInit: {
						mode: 'cors',
						cache: 'no-cache',
					}
				}
			})
			screenshot.value = canvas
			const pdf = new $pdf({
				orientation: "p",
				unit: "px",
				format: [width.value, height.value]
			})
			const img = pdf.getImageProperties(screenshot.value)
			const pdfw = pdf.internal.pageSize.getWidth()
			const pdfh = (img.height * pdfw) / img.width
			pdf.addImage(screenshot.value, 'PNG', 0, 0, pdfw, pdfh, undefined, 'FAST')
			file.value = pdf.output('datauristring')
		}

		const res = await $fetch('/api/mail', {
			method: 'post',
			body: {
				to: email.value,
				subject: 'Here is your Invoice',
				file: file.value,
				filename: `${props.input.invoiceNumber}.pdf`,
			},
		})

		if(!res) {
			throw createError({
				statusCode: 500,
				statusMessage: 'Error sending mail',
			})
		}
	} catch(e) {
		console.log(e)
	} finally {
		isSaving.value = false
	}
}
</script>

<template lang="pug">
section#body-outlet
	div(class="flex")
		div(:class="['bg-neutral-200 h-screen p-6 lg:w-2/3 overflow-auto', {'!w-full': !show}]")
			svgo-slider(v-if="!show" class="absolute top-5 right-4 text-neutral-800 text-lg cursor-pointer" @click="toggleShow")
			.buttons(class="space-x-4 pb-6 flex justify-center")
				button(v-if="!isDownloading" @click="DownloadPDF" class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700") Download PDF
				button(v-else class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700")
					svgo-spinner(class="mx-auto")
				button(v-if="!isSaving" @click="sendToEmail" class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700") Send to Email
				button(v-else class="bg-neutral-800 h-9 text-sm px-4 text-white hover:bg-neutral-700")
					svgo-spinner(class="mx-auto")
				button(@click="$router.go(-1)" class="bg-white h-9 text-sm px-4 text-black hover:bg-neutral-100") Edit PDF
			templates-default(v-if="formatting.template === 'Default'" ref="invoice" :input="input" :handleTotal="handleTotal" :handleTotalAfterTax="handleTotalAfterTax" :tax="tax" :discount="discount"  :formatting="formatting" :logo="logo")
			templates-classic(v-if="formatting.template === 'Classic'" ref="invoice" :input="input" :handleTotal="handleTotal" :handleTotalAfterTax="handleTotalAfterTax" :tax="tax" :discount="discount"  :formatting="formatting" :logo="logo")
			templates-bubblegum(v-if="formatting.template === 'Bubblegum'" ref="invoice" :input="input" :handleTotal="handleTotal" :handleTotalAfterTax="handleTotalAfterTax" :tax="tax" :discount="discount"  :formatting="formatting" :logo="logo")
		div(v-if="show" class="max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-40 bg-white h-screen p-6 w-full lg:w-1/3 overflow-auto")
			header(class="flex items-center justify-end space-x-4")
				svgo-close(class="text-2xl text-red-500 hover:text-red-600 cursor-pointer" @click="toggleShow")
			.settings-sections(class="space-y-12 *:border-b *:border-zinc-300 *:pb-8 last:border-b-0")
				div(v-if="formatting.template === 'Default'")
					div(class="flex items-center pb-6 space-x-2")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Formatting
						.reset(class="text-xs text-red-500 cursor-pointer" @click="handleReset") Reset
					.format-settings(class="text-sm tracking-tight space-y-2")
						div(class="flex items-center")
							p Header Background Color
							input(type="color" class="w-12 ms-auto p-0 border-none rounded-none" v-model="formatting.headerBgColor")
						div(class="flex items-center")
							p Header Text Color
							input(type="color" class="w-12 ms-auto p-0 border-none rounded-none" v-model="formatting.headerTextColor")
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Templates
					select(class="block w-full p-2 bg-white text-neutral-800" v-model="formatting.template")
						option(disabled value="") Select Theme
						option(selected) Default
						option Classic
						option Bubblegum
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Information
					div(class="text-sm tracking-tight space-y-4")
						h6(class="font-medium") Found a bug, or have an idea for a new feature?
						p If you have an idea that would help you and other users in creating your resume more easily send me an email about it.
						button(class="bg-neutral-800 h-9 text-sm w-full text-white hover:bg-neutral-700" @click="navigateTo('mailto:sup@niiaryeh.com', {external: true})") Send Me an Email
</template>
