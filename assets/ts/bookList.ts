import { $, next } from './utils';

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
    private table = $('#book-table');

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
                this.buildTable();
        });

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

    private buildTable(page: number = 0, rowCount: number = 10) {
        const start = page * rowCount;
        const rows = this.readBooks.slice(start, start + rowCount);
        this.table.querySelector('tbody').innerHTML = '';
        rows.forEach((row: ResultRow) => {
            if (row.isRead) {
                this.addRow(row, page);
            }
        });

        this.buildPagination()
    };

    private buildPagination(page: number = 1, rowCount: number = 10) {
        const pages = Math.ceil(this.readBooks.length / rowCount);
        const commonClasses = ['relative', 'inline-flex', 'items-center', 'px-4', 'py-2', 'text-sm', 'font-semibold'];
        const defaultClasses = ['ring-1', 'ring-inset', 'ring-neutral-200', 'dark:ring-neutral-700', 'hover:bg-neutral-100', 'dark:hover:bg-neutral-600', 'focus:outline-offset-0'];
        const selectedClasses = ['z-10', 'bg-primary-600', 'text-neutral-50', 'focus-visible:outline', 'focus-visible:outline-2', 'focus-visible:outline-offset-2', 'focus-visible:outline-indigo-600'];

        const nav = next(this.table, 'div').querySelector('nav');
        const nextArrow = Array.from(nav.querySelectorAll('a')).at(-1);

        if(pages > 1) {
            let filler = false;
            for(let i = 1; i <= pages; i++) {
                if (pages > 7 && (i > 3 && i <= pages - 3)) {
                    if (!filler) {
                        const span = document.createElement('span');
                        span.classList.add(...commonClasses, ...defaultClasses);
                        span.innerText = '...';
                        nav.append(span);
                        filler = !filler;
                    }
                    continue;
                }
                let a = document.createElement('a');
                a.setAttribute('href', '#');
                a.classList.add(...commonClasses, ...(i === page ? selectedClasses : defaultClasses));
                a.textContent = i.toString();

                nextArrow.before(a);
            }
        }
    }

    private addRow(rowData: ResultRow, page: number = 1) {
        // title, authorLast, authorFirst, readDate
        const rowHtml =
            `<td>${rowData.title}</td>` +
            `<td>${rowData.authorLast}, ${rowData.authorFirst}</td>` +
            `<td>${rowData.read}</td>` ;

        const template = document.createElement('tr');
        template.innerHTML = rowHtml.trim();

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
