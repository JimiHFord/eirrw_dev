import FuzzySearch from "fuzzy-search";
import { Filter, TableState } from "ts/types";
import * as utils from "ts/utils";

export abstract class AbstractTable<T extends Object> {
    protected data: Array<T>;
    protected table: HTMLElement;
    protected searcher: FuzzySearch<T>;
    protected abstract fetchPath: string;
    protected abstract searchFields: Array<string>;

    protected state: TableState<T> = {
        page: 0,
        pageRows: 10,
        totalRows: 0,
        searchString: '',
        sort: null,
        filter: [],
    }

    public constructor(table: HTMLElement) {
        this.table = table;
    }

    public init(data?: T[]) {
        const initialize = (data: T[]) => {
            this.data = this.processData(data);

            this.sort()
            this.updateHeaders()
            this.searcher = new FuzzySearch(this.data, this.searchFields);
            this.buildTable();
        }

        if (data === undefined) {
            fetch(this.fetchPath).then(
                response => response.json()
            ).then(
                (data) => {
                    if (!data.results.length) { return };
                    const results = data.results as T[];

                    initialize(results);
            });
        } else {
            initialize(data);
        }

        utils.addEventListener(utils.next(this.table, 'div').querySelector('.search'), 'input', (e: Event) => {
            this.state.searchString = (e.target as HTMLInputElement).value;
            this.state.page = 0;
            this.buildTable();
        });

        this.handlePagination();
        if (this.state.sort !== null) { this.handleSort() };
    };

    protected processData(data: T[]) {
        return data;
    }

    protected handlePagination() {
        const nav = utils.next(this.table, 'div').querySelector('nav');
        let pageNav = nav.querySelectorAll('a');

        // first
        utils.addEventListener(pageNav[0], 'click', (e: Event) => {
            e.preventDefault();
            if (this.state.page !== 0) {
                this.state.page = 0;
                this.buildTable()
            }
        });

        // previous
        utils.addEventListener(pageNav[1], 'click', (e: Event) => {
            e.preventDefault();
            if (this.state.page !== 0) {
                this.state.page--;
                this.buildTable();
            }
        });

        // next
        utils.addEventListener(pageNav[2], 'click', (e: Event) => {
            e.preventDefault();
            const pages = Math.floor((this.state.totalRows - 1) / this.state.pageRows); // get zero-indexed count of pages
            if (this.state.page < pages) {
                this.state.page++;
                this.buildTable();
            }
        });

        // last
        utils.addEventListener(pageNav[3], 'click', (e: Event) => {
            e.preventDefault();
            const pages = Math.floor((this.state.totalRows - 1) / this.state.pageRows); // get zero-indexed count of pages
            if (this.state.page != pages) {
                this.state.page = pages;
                this.buildTable()
            }
        });
    }

    protected handleSort() {
        const headers: NodeListOf<HTMLElement> = this.table.querySelectorAll('th.sortable');
        const sort = (field: number) => {
            if (this.state.sort.field === field) {
                this.state.sort.asc = !this.state.sort.asc;
            } else {
                this.state.sort.asc = false
                this.state.sort.field = field;
            }

            this.sort();
            this.buildTable();
            this.updateHeaders();
        };

        Array.from(headers).forEach((header: HTMLElement, index: number) => {
            utils.addEventListener(header, 'click', () => { sort(index) });
        });
    }

    protected sort() {
        let method = this.state.sort.methods[this.state.sort.field];

        this.data.sort(method);
        if (this.state.sort.asc) { this.data.reverse() }
    }

    private updateHeaders() {
        // svgs from heroicons
        const arrow_up = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>`;
        const arrow_down = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /> </svg>`;
        const arrow_both = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clip-rule="evenodd" /> </svg>`;

        const headers: NodeListOf<HTMLElement> = this.table.querySelectorAll('th.sortable');

        Array.from(headers).forEach((header: HTMLElement, index: number) => {
            let arrow = arrow_both;
            if (this.state.sort.field === index) {
                arrow = this.state.sort.asc ? arrow_up : arrow_down;
            }
            header.querySelector('span').innerHTML = arrow;
        });
    }

    protected updateCount(start: number) {
        const counts = utils.next(this.table, 'div').querySelector('.count').querySelectorAll('span');
        counts[0].innerText = String(Math.min(start + 1, this.state.totalRows));
        counts[1].innerText = String(Math.min(start + this.state.pageRows, this.state.totalRows));
        counts[2].innerText = String(this.state.totalRows);
    }

    protected buildTable() {
        const start = this.state.page * this.state.pageRows;
        let rows = this.searcher.search(this.state.searchString);
        this.state.filter.forEach((filter) => {
            if (Array.isArray(filter)) {
                rows = rows.filter((row: T) => filter.some((filter: Filter) => row[filter.field] == filter.value))
            } else {
                rows = rows.filter((row: T) => row[filter.field] == filter.value)
            }
        });
        this.state.totalRows = rows.length;

        const displayRows = rows.slice(start, start + this.state.pageRows);
        this.table.querySelector('tbody').innerHTML = '';
        displayRows.forEach((row: T) => {
            let template = this.addRow(row);
            this.table.querySelector('tbody').append(template);
        });

        this.updateCount(start);
    };

    protected abstract addRow(row: T): HTMLElement;
}
