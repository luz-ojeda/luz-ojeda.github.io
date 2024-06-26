export const calcAge = (function () {
    const now = new Date()
    const birthDate = new Date(1994, 0, 1);
    let age = now.getFullYear() - birthDate.getFullYear()

    // Calculate if birthday has passed in the current year
    const month = now.getMonth() - birthDate.getMonth()
    if(month < 0) age--;

    return age;
})();