import { ResultRow, TableState } from "ts/types";
import { AbstractTable } from "./AbstractTable";
import * as utils from "ts/utils";

export class BooksTbrTable extends AbstractTable<ResultRow> {
    protected fetchPath: string = '/api/books';
    protected searchFields: string[] = ['title', 'authorLast', 'authorFirst'];

    public init(data: ResultRow[]): void {
        this.state.sort = {
            asc: false,
            field: 2,
            methods: [
                BooksTbrTable.sortTitle,
                BooksTbrTable.sortName,
                BooksTbrTable.sortAdded,
                BooksTbrTable.sortRelease,
            ],
        }

        // expanding rows
        utils.addEventListener(this.table, 'click', (event: Event) => {
            utils.last(event.target as HTMLElement, 'td').classList.toggle('hidden')
        }, 'tbody tr');

        super.init(data);
    }

    protected processData(data: ResultRow[]): ResultRow[] {
        return data.filter((book: ResultRow) => !book.read);
    }

    private static sortName(a: ResultRow, b: ResultRow): number {
        if (a.authorLast > b.authorLast) { return 1 }
        else if (a.authorLast < b.authorLast) { return -1 }
        else {
            if (a.authorFirst > b.authorFirst) { return 1 }
            else if (a.authorFirst < b.authorFirst) { return -1 }
            else { return BooksTbrTable.sortAdded(a, b) }
        }
    };

    private static sortTitle(a: ResultRow, b: ResultRow): number {
        return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : BooksTbrTable.sortAdded(a, b);
    };

    private static sortAdded(a: ResultRow, b: ResultRow): number {
        const aAdded = new Date(a.added);
        const bAdded = new Date(b.added);

        return (aAdded < bAdded) ? 1 : (aAdded > bAdded) ? -1 : BooksTbrTable.sortRelease(a, b);
    }

    private static sortRelease(a: ResultRow, b: ResultRow): number {
        const aRelease = new Date(a.release);
        const bRelease = new Date(b.release);

        return (aRelease < bRelease) ? 1 : (aRelease > bRelease) ? -1 : 0;
    }

    protected addRow(rowData: ResultRow): HTMLElement {
        // title, author, added, release
        const rowHtml =
            utils.safeHTML`
            <td class="sm:col-span-2 lg:col-span-4">${rowData.title}</td>
            <td class="sm:col-span-2 lg:col-span-3">${rowData.authorLast}, ${rowData.authorFirst}</td>
            <td class="sm:col-span-1 lg:col-span-1">${rowData.added}</td>
            <td class="sm:col-span-1 lg:col-span-1 max-sm:hidden">${rowData.release}</td>
            <td class="hidden col-span-full">test data</td>`;

        const template = document.createElement('tr');
        template.innerHTML = rowHtml.trim();
        template.classList.add('grid', 'grid-cols-3', 'sm:grid-cols-6', 'lg:grid-cols-9')
        
        return template;
    };
}
