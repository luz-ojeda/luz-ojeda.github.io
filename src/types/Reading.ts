export type Book = {
    title: string;
    link: string;
    image: string;
    genres: string[];
    status: string;
    author: string;
    highlight?: string | null;
    loved?: boolean | null;
};

export type BooksByYear = Record<string, Book[]>;
