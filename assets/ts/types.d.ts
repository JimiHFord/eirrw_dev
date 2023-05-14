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

export interface ResultRow {
  title: string;
  authorLast: string;
  authorFirst: string;
  release: string;
  added?: string;
  read?: string;
  isRead: boolean;
  series?: string;
  recommendBook: boolean;
  recommendSeries: boolean;
}

export type SortMethod<T> = (a: T, b: T) => number;

export interface SortStatus<T> {
    asc: boolean;
    field: number;
    methods: Array<SortMethod<T>>;
}

export interface Filter {
    field: string;
    value: any;
}

export interface TableState<T> {
    page: number;
    pageRows: number;
    totalRows: number;
    searchString: string;
    sort: SortStatus<T>;
    filter: Array<Filter|Array<Filter>>;
}
