import { domToPng } from 'modern-screenshot'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.provide('screenshot', domToPng)
})