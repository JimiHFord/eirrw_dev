import FuzzySearch from 'fuzzy-search';
import {$, $$} from './utils';
import * as utils from './utils';

interface ResultRow {
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

export default class BookList {
    private readBooks: ResultRow[] = [];
    private tbrBooks: ResultRow[] = [];
    private table: HTMLElement = $('#book-table');
    private page: number = 0;
    private rowCount: number = 10;
    private searcher?: FuzzySearch<ResultRow> = null;
    private searchString: string = '';
    private totalRows: number = 0;

    public init() {
        fetch('/api/books').then(
            response => response.json()
        ).then(
            (data) => {
                if (!data.results.length) { return };
                const allBooks = data.results as ResultRow[];
                this.readBooks = allBooks.filter((book: ResultRow) => book.read);
                this.tbrBooks = allBooks.filter((book: ResultRow) => !book.read);

                this.readBooks.sort(BookList.sortRead).reverse()
                this.searcher = new FuzzySearch(this.readBooks, ['title', 'authorLast', 'authorFirst']);
                this.buildTable();
        });

        utils.addEventListener(this.table, 'click', (event: Event) => {utils.last(event.target as HTMLElement, 'td').classList.toggle('hidden')}, 'tbody tr');
        utils.addEventListener(utils.next(this.table, 'div').querySelector('#read-search'), 'input', (e: Event) => {
            this.searchString = e.target.value;
            this.page = 0;
            this.buildTable();
        });

        this.handlePagination()


        //  $('#book-table').DataTable({
        //    ajax: {
        //      url: "/api/books",
        //      dataSrc: 'results'
        //    },
        //    columns: [
        //      {
        //        data: 'title',
        //        render: (data, _, row) => `<span class="${row.recommendBook ? 'font-semibold' : ''}">${data}</span>`
        //      },
        //      { data: 'authorLast', orderData: [ 1, 2 ] },
        //      { data: 'authorFirst', orderData: [ 2, 1 ] },
        //      { data: 'release' },
        //      { data: 'added' },
        //      { data: 'read', orderData: [ 5, 4, 1 ] },
        //      { data: 'isRead', visible: false },
        //      { 
        //        data: 'series',
        //        render: (data, _, row) => 
        //        data ? `<span class="${row.recommendSeries ? 'font-semibold' : ''}">${data}</span> ` +
        //          `(${row.seriesEntry})`
        //            : ''
        //      },
        //    ],
        //    rowGroup: {
        //      dataSrc: 'isRead',
        //      startRender: (rows, group): string => group == '1' ? `Read (${rows.count()})`  : `TBR (${rows.count()})`
        //    },
        //    paging: false,
        //    searching: false,
        //    info: false,
        //    order: [[6, 'desc'], [5, 'desc']],
        //    orderFixed: [6, 'desc'],
        //    scrollX: false,
        //    fixedHeader: true,
        //    responsive: true,
        //    autoWidth: false
        //  } );
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

    private addRow(rowData: ResultRow, page: number = 1) {
        // title, author, readDate
        const rowHtml =
            `<td>${rowData.title}</td>` +
            `<td>${rowData.authorLast}, ${rowData.authorFirst}</td>` +
            `<td>${rowData.read}</td>` +
            `<td class="hidden col-span-full">test data</td>`;

        const template = document.createElement('tr');
        template.innerHTML = rowHtml.trim();
        template.classList.add('grid', 'grid-cols-3')

        this.table.querySelector('tbody').append(template);
    };

    private static sortName(a: ResultRow, b: ResultRow) {
        if (a.authorLast > b.authorLast) { return 1 }
        else if (a.authorLast < b.authorLast) { return -1 }
        else {
            if (a.authorFirst > b.authorFirst) { return 1 }
            else if (a.authorFirst < b.authorFirst) { return -1 }
            else { return 0 }
        }
    };

    private static sortTitle(a: ResultRow, b: ResultRow) {
        return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0;
    };

    private static sortRead(a: ResultRow, b: ResultRow) {
        const aRead = new Date(a.read);
        const bRead = new Date(b.read);

        return (aRead > bRead) ? 1 : (aRead < bRead) ? -1 : 0;
    }
};
