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
div(v-if="$device.isMobile" class="h-dvh flex justify-center items-center")
	p Kindly access app from desktop
div(v-if="$device.isDesktop")
	#banner(v-if="show" class="fixed z-50 w-full bottom-0 left-0 py-2 bg-neutral-800 text-sm text-white flex items-center justify-center px-4")
		NuxtLink(to="https://paystack.com/pay/invoice-by-niiaryeh")
			div(class="flex space-x-4 group")
				p Support Invoice by Nii Aryeh
				svgo-arrow(class="text-xl rotate-180 group-hover:translate-x-2 duration-150")
		svgo-close(class="absolute right-4 text-xl cursor-pointer hover:scale-90" @click="() => show = !show")
	NuxtPage
</template>