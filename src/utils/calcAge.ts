export const calcAge = (function () {
	const now = new Date();
	const birthDate = new Date(1994, 0, 6);

	let age = now.getFullYear() - birthDate.getFullYear();

	// Calculate if birthday has passed in the current year
	const currentMonth = now.getMonth();
	const bdayMonth = birthDate.getMonth();

	const birthdayNotHappenedYet =
		(currentMonth === bdayMonth && now.getDate() < birthDate.getDate()) ||
		bdayMonth > currentMonth;

	if (birthdayNotHappenedYet) {
		age--;
	}

	return age;
})();
