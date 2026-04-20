const DAYS_IN_DEFAULT_DUE_PERIOD = 30

const toISODate = (date: Date): string => date.toISOString().split('T')[0]!

export const getTodayDate = (): string => toISODate(new Date())

export const getDueDate = (daysFromToday: number = DAYS_IN_DEFAULT_DUE_PERIOD): string => {
	const date = new Date()
	date.setDate(date.getDate() + daysFromToday)
	return toISODate(date)
}
