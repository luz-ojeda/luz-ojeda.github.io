interface HasDate {
    data: {
        pubDate: string | Date;
    };
}

export default function sortByDate <T extends HasDate>(a: T, b: T) {
    return new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf();
};