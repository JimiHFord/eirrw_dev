import FuzzySearch from 'fuzzy-search';
import {$, $$} from './utils';
import * as utils from './utils';
import { ResultRow } from './types';

enum SortField {
    TITLE,
    AUTHOR,
    READDATE,
}

interface SortStatus {
    asc: boolean;
    field: SortField;
}

export default class BookList {
    private readBooks: ResultRow[] = [];
    private tbrBooks: ResultRow[] = [];
    private table: HTMLElement = $('#book-table');
    private page: number = 0;
    private rowCount: number = 10;
    private searcher?: FuzzySearch<ResultRow> = null;
    private searchString: string = '';
    private totalRows: number = 0;
    private sortStatus: SortStatus = {
        asc: false,
        field: SortField.READDATE
    }

    public init() {
        fetch('/api/books').then(
            response => response.json()
        ).then(
            (data) => {
                if (!data.results.length) { return };
                const allBooks = data.results as ResultRow[];
                this.readBooks = allBooks.filter((book: ResultRow) => book.read);
                this.tbrBooks = allBooks.filter((book: ResultRow) => !book.read);

                this.sort()
                this.updateHeaders()
                this.searcher = new FuzzySearch(this.readBooks, ['title', 'authorLast', 'authorFirst']);
                this.buildTable();
        });

        utils.addEventListener(this.table, 'click', (event: Event) => {utils.last(event.target as HTMLElement, 'td').classList.toggle('hidden')}, 'tbody tr');
        utils.addEventListener(utils.next(this.table, 'div').querySelector('#read-search'), 'input', (e: Event) => {
            this.searchString = (e.target as HTMLInputElement).value;
            this.page = 0;
            this.buildTable();
        });

        this.handlePagination();
        this.handleSort();
    };

    private buildTable() {
        const start = this.page * this.rowCount;
        const rows = this.searcher.search(this.searchString);
        this.totalRows = rows.length;

        const displayRows = rows.slice(start, start + this.rowCount);
        this.table.querySelector('tbody').innerHTML = '';
        displayRows.forEach((row: ResultRow) => {
            if (row.isRead) {
                this.addRow(row, this.page);
            }
        });

        const counts = utils.next(this.table, 'div').querySelector('#read-count').querySelectorAll('span');
        counts[0].innerText = String(Math.min(start + 1, this.totalRows));
        counts[1].innerText = String(Math.min(start + this.rowCount, this.totalRows));
        counts[2].innerText = String(this.totalRows);
    };

    private handlePagination() {
        const nav = utils.next(this.table, 'div').querySelector('nav');
        let pageNav = nav.querySelectorAll('a');

        // first
        utils.addEventListener(pageNav[0], 'click', (e: Event) => {
            e.preventDefault();
            if (this.page !== 0) {
                this.page = 0;
                this.buildTable()
            }
        });

        // previous
        utils.addEventListener(pageNav[1], 'click', (e: Event) => {
            e.preventDefault();
            if (this.page !== 0) {
                this.page--;
                this.buildTable();
            }
        });

        // next
        utils.addEventListener(pageNav[2], 'click', (e: Event) => {
            e.preventDefault();
            const pages = Math.floor(this.totalRows / this.rowCount); // get zero-indexed count of pages
            if (this.page < pages) {
                this.page++;
                this.buildTable();
            }
        });

        // last
        utils.addEventListener(pageNav[3], 'click', (e: Event) => {
            e.preventDefault();
            const pages = Math.floor(this.totalRows / this.rowCount); // get zero-indexed count of pages
            if (this.page != pages) {
                this.page = pages;
                this.buildTable()
            }
        });
    }

    private handleSort() {
        const headers: NodeListOf<HTMLElement> = this.table.querySelectorAll('th.sortable');
        const sort = (field: SortField) => {
            if (this.sortStatus.field === field) {
                this.sortStatus.asc = !this.sortStatus.asc;
            } else {
                this.sortStatus.asc = false
                this.sortStatus.field = field;
            }

            this.sort();
            this.buildTable();
            this.updateHeaders();
        };

        utils.addEventListener(headers[0], 'click', () => { sort(SortField.TITLE) });
        utils.addEventListener(headers[1], 'click', () => { sort(SortField.AUTHOR) });
        utils.addEventListener(headers[2], 'click', () => { sort(SortField.READDATE) });
    }

    private addRow(rowData: ResultRow, page: number = 1) {
        // title, author, readDate
        const rowHtml =
            `<td class="sm:col-span-5">${rowData.title}</td>` +
            `<td class="sm:col-span-4">${rowData.authorLast}, ${rowData.authorFirst}</td>` +
            `<td class="sm:col-span-2">${rowData.read}</td>` +
            `<td class="hidden col-span-full">test data</td>`;

        const template = document.createElement('tr');
        template.innerHTML = rowHtml.trim();
        template.classList.add('grid', 'grid-cols-3', 'sm:grid-cols-12')

        this.table.querySelector('tbody').append(template);
    };

    private sort() {
        let method = null;
        switch (this.sortStatus.field) {
            case SortField.TITLE:
                method = BookList.sortTitle;
                break;
            case SortField.AUTHOR:
                method = BookList.sortName;
                break
            case SortField.READDATE:
                method = BookList.sortRead;
        }

        this.readBooks.sort(method);
        if (this.sortStatus.asc) { this.readBooks.reverse() }
    }

    private updateHeaders() {
        const arrow_up = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>`;
        const arrow_down = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /> </svg>`;
        const arrow_both = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"> <path fill-rule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clip-rule="evenodd" /> </svg>`;

        const headers: NodeListOf<HTMLElement> = this.table.querySelectorAll('th.sortable');
        const update = (field: SortField) => {
            if (this.sortStatus.field === field) {
                return this.sortStatus.asc ? arrow_up : arrow_down;
            } else {
                return arrow_both;
            }
        }

        headers[0].querySelector('span').innerHTML = update(SortField.TITLE);
        headers[1].querySelector('span').innerHTML = update(SortField.AUTHOR);
        headers[2].querySelector('span').innerHTML = update(SortField.READDATE);
    }

    private static sortName(a: ResultRow, b: ResultRow) {
        if (a.authorLast > b.authorLast) { return 1 }
        else if (a.authorLast < b.authorLast) { return -1 }
        else {
            if (a.authorFirst > b.authorFirst) { return 1 }
            else if (a.authorFirst < b.authorFirst) { return -1 }
            else { return BookList.sortRead(a, b) }
        }
    };

    private static sortTitle(a: ResultRow, b: ResultRow) {
        return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : BookList.sortRead(a, b);
    };

    private static sortRead(a: ResultRow, b: ResultRow) {
        const aRead = new Date(a.read);
        const bRead = new Date(b.read);

        return (aRead < bRead) ? 1 : (aRead > bRead) ? -1 : 0;
    }
};
