import { $ } from './utils';
import { BooksReadTable } from './table/BooksReadTable';
import { BooksTbrTable } from './table/BooksTbrTable';

export default class BookList {
    private readTable: BooksReadTable;
    private tbrTable: BooksTbrTable;

    public init() {
        this.readTable = new BooksReadTable($('#book-table'));
        this.readTable.init();

        this.tbrTable = new BooksTbrTable($('#tbr-table'));
        this.tbrTable.init();
    };
};
