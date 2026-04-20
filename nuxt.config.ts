export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: false },
	modules: [
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt",
		"dayjs-nuxt",
		"@nuxt/fonts",
		"@nuxtjs/device",
	],
	tailwindcss: {
		viewer: false,
		cssPath: ["~/assets/tailwind.css", { injectPosition: "first" }],
	},
	fonts: {
		families: [
			{ name: "Jost", provider: "google", weights: [300, 400, 500, 600, 700, 900] },
		],
	},
	runtimeConfig: {
		mailUser: process.env.NUXT_MAIL_USER,
		mailPass: process.env.NUXT_MAIL_PASS,
	},
	nitro: {
		preset: "vercel",
	},
})
