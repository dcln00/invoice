export const useEmail = () => useState<string>('email', () => '')

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value)

export const requireEmail = async () => {
	const email = useEmail()
	if (!email.value) return navigateTo('/')
}
