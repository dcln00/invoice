import { domToPng } from 'modern-screenshot'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.provide('screenshot', domToPng)
})

declare module '#app' {
	interface NuxtApp {
		$screenshot: typeof domToPng
	}
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$screenshot: typeof domToPng
	}
}
