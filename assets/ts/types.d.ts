export interface AuthorData {
    id?: number;
    firstName: string;
    lastName: string;
}

export interface SeriesData {
    id?: number;
    name: string;
    recommend: boolean;
}

export interface NewBookData {
    title: string;
    release: string;
    readDate?: string;
    authors: number[];
    series?: number;
    seriesEntry?: number;
    recommend: boolean
}
