export function checkMonth(month: number): boolean {
	const currentMonth = new Date().getMonth(); // 0 is January, 9 is October
	return currentMonth === month;
}
