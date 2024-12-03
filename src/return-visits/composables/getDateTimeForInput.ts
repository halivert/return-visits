export function getDateForInput(date?: Date) {
	if (!date) return ""

	return [
		date.getFullYear(),
		(date.getMonth() + 1).toString().padStart(2, "0"),
		date.getDate().toString().padStart(2, "0"),
	].join("-")
}

export function getTimeForInput(date?: Date) {
	if (!date) return ""

	return [
		date.getHours().toString().padStart(2, "0"),
		date.getMinutes().toString().padStart(2, "0"),
	].join(":")
}

export function getDateTimeForInput(date?: Date) {
	return {
		date: getDateForInput(date),
		time: getTimeForInput(date),
	}
}
