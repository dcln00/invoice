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
	// First, ensure the font is loaded in the document
	const loadFontInDocument = async () => {
		// Check if Jost font is already loaded
		const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Jost"]')
		
		if (!existingLink) {
			// Load Jost font from Google Fonts with all weights and styles
			const fontLink = document.createElement('link')
			fontLink.href = 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap'
			fontLink.rel = 'stylesheet'
			document.head.appendChild(fontLink)
			
			// Wait for the link to load
			await new Promise((resolve) => {
				fontLink.onload = resolve
				fontLink.onerror = resolve // Continue even if there's an error
				// Fallback timeout
				setTimeout(resolve, 3000)
			})
		}
	}
	
	// Load font in document first
	await loadFontInDocument()
	
	// Wait for fonts to be ready
	if (document.fonts && document.fonts.ready) {
		await document.fonts.ready
	}
	
	// Safari-specific: Load specific font weights that are used in the templates
	if (document.fonts) {
		try {
			// Load multiple font weights that are used in the templates
			await Promise.all([
				document.fonts.load('300 16px Jost'), // font-light
				document.fonts.load('400 16px Jost'), // font-normal
				document.fonts.load('500 16px Jost'), // font-medium
				document.fonts.load('600 16px Jost'), // font-semibold
				document.fonts.load('700 16px Jost'), // font-bold
				document.fonts.load('900 16px Jost'), // font-black
			])
		} catch (error) {
			console.warn('Font loading error:', error)
		}
	}
	
	// Safari-specific: Longer wait and multiple repaints
	await new Promise(resolve => setTimeout(resolve, 1500))
	
	// Force multiple repaints to ensure fonts are applied in Safari
	if (invoice.value && invoice.value.inv) {
		const element = invoice.value.inv
		
		// Multiple repaint cycles for Safari
		for (let i = 0; i < 3; i++) {
			element.style.display = 'none'
			element.offsetHeight // Force reflow
			element.style.display = ''
			await new Promise(resolve => setTimeout(resolve, 100))
		}
	}
	
	// Final verification that fonts are loaded
	if (document.fonts) {
		try {
			// Create a test element and verify font is applied
			const testElement = document.createElement('span')
			testElement.style.fontFamily = 'Jost, sans-serif'
			testElement.style.fontWeight = '400'
			testElement.style.visibility = 'hidden'
			testElement.style.position = 'absolute'
			testElement.style.left = '-9999px'
			testElement.textContent = 'Test'
			document.body.appendChild(testElement)
			
			// Wait a bit more for Safari to apply the font
			await new Promise(resolve => setTimeout(resolve, 500))
			
			// Check if the font is actually applied
			const computedStyle = window.getComputedStyle(testElement)
			const fontFamily = computedStyle.fontFamily
			
			document.body.removeChild(testElement)
			
			// If font is not applied, wait a bit more
			if (!fontFamily.includes('Jost')) {
				console.warn('Font not applied, waiting more...')
				await new Promise(resolve => setTimeout(resolve, 1000))
			}
		} catch (error) {
			console.warn('Font verification error:', error)
		}
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
