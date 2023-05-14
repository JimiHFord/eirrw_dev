import { $ } from './utils';
import { BooksReadTable } from './table/BooksReadTable';
import { BooksTbrTable } from './table/BooksTbrTable';
import { ResultRow } from './types';

export default class BookList {
    private readTable: BooksReadTable;
    private tbrTable: BooksTbrTable;

    public init() {
        this.readTable = new BooksReadTable($('#book-table'));
        this.tbrTable = new BooksTbrTable($('#tbr-table'));

        fetch('/api/books').then(
            response => response.json()
        ).then(
            (data) => {
                if (!data.results.length) { return };
                const results = data.results as ResultRow[];

                this.readTable.init(results);
                this.tbrTable.init(results);
        });
    };
};
