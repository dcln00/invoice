<script setup lang="ts">
const email = useState('email', () => '')
const isLoading = ref(false)
const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const handleSubmit = async () => {
	try {
		if (!pattern.test(email.value)) return

		isLoading.value = true
		await navigateTo('/app')
	} finally {
		isLoading.value = false
	}
}
</script>

<template lang="pug">
div(class="flex flex-wrap")
	div(class="hidden w-1/2 p-4 h-[50vh] lg:h-screen lg:flex flex-col items-center justify-center space-y-4")
		h1(class="text-5xl tracking-tight font-light") #[span(class="text-brand-accent") in]#[span(class="text-brand-black") voice (beta)]
		p(class="tracking-tight text-zinc-600") Create and export your invoice in 3 easy steps
	div(class="w-full lg:w-1/2 p-4 h-screen bg-zinc-200 flex flex-col items-center justify-center")
		div(class="block lg:hidden space-y-4 text-center pb-6")
			h1(class="text-5xl tracking-tight font-light") #[span(class="text-brand-accent") in]#[span(class="text-brand-black") voice (beta)]
			p(class="tracking-tight text-zinc-600") Create and export your invoice in 3 easy steps
		form(novalidate class="w-full lg:w-3/4" @submit.prevent="handleSubmit")
			div(class="flex items-center")
				.input-groups(class="w-8/12 p-2")
					input(type="email" v-model="email" name="email" required placeholder="Enter your email" class="border-none rounded-none p-0 h-9 px-2 w-full focus:ring-1 focus:ring-black [&:not(:placeholder-shown):not(:focus):invalid]:text-red-600 [&:not(:placeholder-shown):not(:focus):invalid]:ring-1 [&:not(:placeholder-shown):not(:focus):invalid]:ring-red-600")
				.input-groups(class="w-4/12 p-2")
					button(v-if="isLoading" type="submit" class="bg-neutral-800 h-9 text-sm w-full text-white hover:bg-neutral-700")
						svgo-spinner(class="mx-auto")
					button(v-else type="submit" class="bg-neutral-800 h-9 text-sm w-full text-white hover:bg-neutral-700") Next
</template>