interface HasDate {
	data: {
		pubDate: string | Date;
	};
}

export default function sortByDate<T extends HasDate>(a: T, b: T) {
	return new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf();
}

export function checkMonth(month: number): boolean {
	const currentMonth = new Date().getMonth(); // 0 is January, 9 is October
	return currentMonth === month;
}
