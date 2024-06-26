interface HasDate {
    data: {
        date: string | Date;
    };
}

export default function sortByDate <T extends HasDate>(a: T, b: T) {
    return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};