const MAX_LOGO_BYTES = 5 * 1024 * 1024

export const useLogoUpload = () => {
	const file = shallowRef<File | null>(null)
	const fileUrl = useState<string>('logo', () => '')

	const onFileChange = (event: Event): void => {
		const target = event.target as HTMLInputElement
		const picked = target.files?.[0]
		if (!picked) return

		if (!picked.type.startsWith('image/')) {
			alert('Please upload an image file')
			return
		}

		if (picked.size > MAX_LOGO_BYTES) {
			alert('File size should be less than 5MB')
			return
		}

		file.value = picked
		fileUrl.value = URL.createObjectURL(picked)
	}

	const removeFile = (): void => {
		if (fileUrl.value) URL.revokeObjectURL(fileUrl.value)
		fileUrl.value = ''
		file.value = null
	}

	return { file, fileUrl, onFileChange, removeFile }
}
