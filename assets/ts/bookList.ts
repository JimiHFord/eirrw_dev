import { $ } from './utils';
import { BooksReadTable } from './table/BooksReadTable';

export default class BookList {
    private readTable: BooksReadTable;

    public init() {
        this.readTable = new BooksReadTable($('#book-table'));
        this.readTable.init();
    };
};
