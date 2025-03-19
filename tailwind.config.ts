import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
			},
		},
		extend: {
			colors: {
				brand: {
					accent: '#dbba5e',
					hover: '#b6994a',
					black: '#3e3e3e',
				},
			},
		}
	},
}