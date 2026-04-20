import { jsPDF } from 'jspdf'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.provide('pdf', jsPDF)
})

declare module '#app' {
	interface NuxtApp {
		$pdf: typeof jsPDF
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$pdf: typeof jsPDF
	}
}
