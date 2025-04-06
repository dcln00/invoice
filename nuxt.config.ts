export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: false },
	css: ['quill/dist/quill.snow.css'],
	modules: [
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
		'dayjs-nuxt',
		'nuxt-svgo',
		'@primevue/nuxt-module',
		'@nuxt/fonts',
	],
	tailwindcss: {
		viewer: false,
		cssPath: ['~/assets/tailwind.css', { injectPosition: 'first' }],
	},
	fonts: {
		defaults: {
			weights: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
		},
		provider: 'local'
	},
	primevue: {},
	runtimeConfig: {
		mailHost: process.env.NUXT_MAIL_HOST,
		mailUser: process.env.NUXT_MAIL_USER,
		mailPass: process.env.NUXT_MAIL_PASS,
	},
	nitro: {
		preset: 'vercel',
	},
})