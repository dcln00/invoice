<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
useHead({
	title: 'Invoice by Nii Aryeh',
})

useSeoMeta({
	title: 'Invoice by Nii Aryeh',
	ogTitle: 'Invoice by Nii Aryeh',
	description: `Create and export your invoice in 3 easy steps`,
	ogDescription: `Create and export your invoice in 3 easy steps`,
	ogImageAlt: 'Invoice by Nii Aryeh',
	ogUrl: 'https://invoice.niiaryeh.com/',
	twitterTitle: 'Invoice by Nii Aryeh',
	twitterDescription: 'Create and export your invoice in 3 easy steps',
	twitterCard: 'summary_large_image',
	ogType: 'website',
	ogImageWidth: 1200,
	ogImageHeight: 600,
})

const show = ref(true)
</script>

<template lang="pug">
Analytics
#banner(v-if="show" class="fixed z-50 w-full bottom-0 left-0 py-2 bg-neutral-800 text-sm text-white flex items-center justify-center px-4")
	NuxtLink(to="https://paystack.com/pay/invoice-by-niiaryeh")
		div(class="flex space-x-4 group")
			p Support Invoice by Nii Aryeh
			svgo-arrow(class="text-xl rotate-180 group-hover:translate-x-2 duration-150")
	svgo-close(class="absolute right-4 text-xl cursor-pointer hover:scale-90" @click="() => show = !show")
NuxtPage
</template>
 
 <!-- The above code is a simple invoice generator that allows you to create and export your invoice in 3 easy steps. 
 The invoice generator is built with Vue 3 and Vite. 
 The invoice generator has the following features: 
 Invoice Details From (Your Details) To (Client's Details) Items Taxes & Discounts Payment Terms Grand Total
 The invoice generator is built with Vue 3 and Vite. -->