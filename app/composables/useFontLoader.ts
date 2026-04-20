const FONT_WEIGHTS = ['300', '400', '500', '600', '700', '900'] as const
const FONT_FAMILY = 'Jost'
const SAFARI_SETTLE_MS = 400

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const preloadFontWeights = async (): Promise<void> => {
	if (!document.fonts) return
	try {
		await Promise.all(
			FONT_WEIGHTS.map(weight => document.fonts.load(`${weight} 16px ${FONT_FAMILY}`)),
		)
	} catch (error) {
		console.warn('Font preload failed:', error)
	}
}

export const useFontLoader = () => {
	const ensureFontsLoaded = async (): Promise<void> => {
		await preloadFontWeights()
		if (document.fonts?.ready) await document.fonts.ready
		await wait(SAFARI_SETTLE_MS)
	}

	return { ensureFontsLoaded }
}
