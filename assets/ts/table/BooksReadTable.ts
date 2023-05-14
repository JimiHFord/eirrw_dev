import { ResultRow, TableState } from "ts/types";
import { AbstractTable } from "./AbstractTable";
import * as utils from "ts/utils";

export class BooksReadTable extends AbstractTable<ResultRow> {
    protected fetchPath: string = '/api/books';
    protected searchFields: string[] = ['title', 'authorLast', 'authorFirst'];

    public init(): void {
        this.state.sort = {
            asc: false,
            field: 2,
            methods: [
                BooksReadTable.sortTitle,
                BooksReadTable.sortName,
                BooksReadTable.sortRead,
            ],
        }

        // expanding rows
        utils.addEventListener(this.table, 'click', (event: Event) => {
            utils.last(event.target as HTMLElement, 'td').classList.toggle('hidden')
        }, 'tbody tr');

        super.init();
    }

    protected processData(data: ResultRow[]): ResultRow[] {
        return data.filter((book: ResultRow) => book.read);
    }

    private static sortName(a: ResultRow, b: ResultRow): number {
        if (a.authorLast > b.authorLast) { return 1 }
        else if (a.authorLast < b.authorLast) { return -1 }
        else {
            if (a.authorFirst > b.authorFirst) { return 1 }
            else if (a.authorFirst < b.authorFirst) { return -1 }
            else { return BooksReadTable.sortRead(a, b) }
        }
    };

    private static sortTitle(a: ResultRow, b: ResultRow): number {
        return (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : BooksReadTable.sortRead(a, b);
    };

    private static sortRead(a: ResultRow, b: ResultRow): number {
        const aRead = new Date(a.read);
        const bRead = new Date(b.read);

        return (aRead < bRead) ? 1 : (aRead > bRead) ? -1 : 0;
    }

    protected addRow(rowData: ResultRow): HTMLElement {
        // svgs from svgrepo
        let series = rowData.recommendSeries ? 
            `<svg fill="currentcolor" class="w-5 h-5 m-auto" viewBox="0 0 32 32" id="Flat" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.156 26.492l-6.211-23.184c-0.327-1.183-1.393-2.037-2.659-2.037-0.252 0-0.495 0.034-0.727 0.097l0.019-0.004-2.897 0.776c-0.325 0.094-0.609 0.236-0.86 0.42l0.008-0.005c-0.49-0.787-1.349-1.303-2.33-1.306h-2.998c-0.789 0.001-1.5 0.337-1.998 0.873l-0.002 0.002c-0.5-0.537-1.211-0.873-2-0.874h-3c-1.518 0.002-2.748 1.232-2.75 2.75v24c0.002 1.518 1.232 2.748 2.75 2.75h3c0.789-0.002 1.5-0.337 1.998-0.873l0.002-0.002c0.5 0.538 1.211 0.873 2 0.875h2.998c1.518-0.002 2.748-1.232 2.75-2.75v-16.848l4.699 17.54c0.327 1.182 1.392 2.035 2.656 2.037h0c0.001 0 0.003 0 0.005 0 0.251 0 0.494-0.034 0.725-0.098l-0.019 0.005 2.898-0.775c1.182-0.326 2.036-1.392 2.036-2.657 0-0.252-0.034-0.497-0.098-0.729l0.005 0.019zM18.415 9.708l5.31-1.423 3.753 14.007-5.311 1.422zM18.068 3.59l2.896-0.776c0.097-0.027 0.209-0.043 0.325-0.043 0.575 0 1.059 0.389 1.204 0.918l0.002 0.009 0.841 3.139-5.311 1.423-0.778-2.905v-1.055c0.153-0.347 0.449-0.607 0.812-0.708l0.009-0.002zM11.5 2.75h2.998c0.69 0.001 1.249 0.56 1.25 1.25v3.249l-5.498 0.001v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM8.75 23.25h-5.5v-14.5l5.5-0.001zM10.25 8.75l5.498-0.001v14.501h-5.498zM4.5 2.75h3c0.69 0.001 1.249 0.56 1.25 1.25v3.249l-5.5 0.001v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM7.5 29.25h-3c-0.69-0.001-1.249-0.56-1.25-1.25v-3.25h5.5v3.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM14.498 29.25h-2.998c-0.69-0.001-1.249-0.56-1.25-1.25v-3.25h5.498v3.25c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM28.58 27.826c-0.164 0.285-0.43 0.495-0.747 0.582l-0.009 0.002-2.898 0.775c-0.096 0.026-0.206 0.041-0.319 0.041-0.575 0-1.060-0.387-1.208-0.915l-0.002-0.009-0.841-3.14 5.311-1.422 0.841 3.14c0.027 0.096 0.042 0.207 0.042 0.321 0 0.23-0.063 0.446-0.173 0.63l0.003-0.006z"></path>
            </svg>` : '';
        let book = rowData.recommendBook ?
            `<svg viewBox="0 0 20 20" class="w-5 h-5 m-auto" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3.25001H6.75C6.10713 3.23114 5.483 3.4679 5.01439 3.9084C4.54577 4.3489 4.2709 4.9572 4.25 5.60001V18C4.27609 18.7542 4.60027 19.4673 5.15142 19.9829C5.70258 20.4984 6.43571 20.7743 7.19 20.75H19C19.1981 20.7474 19.3874 20.6676 19.5275 20.5275C19.6676 20.3874 19.7474 20.1981 19.75 20V4.00001C19.7474 3.8019 19.6676 3.61264 19.5275 3.47254C19.3874 3.33245 19.1981 3.2526 19 3.25001ZM18.25 19.25H7.19C6.83339 19.2748 6.48151 19.1571 6.21156 18.9227C5.94161 18.6884 5.77562 18.3566 5.75 18C5.77562 17.6435 5.94161 17.3116 6.21156 17.0773C6.48151 16.843 6.83339 16.7253 7.19 16.75H18.25V19.25ZM18.25 15.25H7.19C6.68656 15.2506 6.19135 15.3778 5.75 15.62V5.60001C5.7729 5.3559 5.89028 5.13039 6.0771 4.9716C6.26392 4.8128 6.50538 4.73329 6.75 4.75001H18.25V15.25Z" fill="currentcolor"/>
                <path d="M8.75 8.75H15.25C15.4489 8.75 15.6397 8.67098 15.7803 8.53033C15.921 8.38968 16 8.19891 16 8C16 7.80109 15.921 7.61032 15.7803 7.46967C15.6397 7.32902 15.4489 7.25 15.25 7.25H8.75C8.55109 7.25 8.36032 7.32902 8.21967 7.46967C8.07902 7.61032 8 7.80109 8 8C8 8.19891 8.07902 8.38968 8.21967 8.53033C8.36032 8.67098 8.55109 8.75 8.75 8.75Z" fill="currentcolor"/>
                <path d="M8.75 12.25H15.25C15.4489 12.25 15.6397 12.171 15.7803 12.0303C15.921 11.8897 16 11.6989 16 11.5C16 11.3011 15.921 11.1103 15.7803 10.9697C15.6397 10.829 15.4489 10.75 15.25 10.75H8.75C8.55109 10.75 8.36032 10.829 8.21967 10.9697C8.07902 11.1103 8 11.3011 8 11.5C8 11.6989 8.07902 11.8897 8.21967 12.0303C8.36032 12.171 8.55109 12.25 8.75 12.25Z" fill="currentcolor"/>
            </svg>` : '';

        // title, author, readDate, recommends
        const rowHtml =
            utils.safeHTML`<td class="sm:col-span-5">${rowData.title}</td>
            <td class="sm:col-span-4">${rowData.authorLast}, ${rowData.authorFirst}</td>
            <td class="sm:col-span-2">${rowData.read}</td>` +
            `<td class="max-sm:hidden grid grid-cols-2"><span>${book}</span><span>${series}</span></td>` +
            utils.safeHTML`<td class="hidden col-span-full">test data</td>`;

        const template = document.createElement('tr');
        template.innerHTML = rowHtml.trim();
        template.classList.add('grid', 'grid-cols-3', 'sm:grid-cols-12')
        
        return template;
    };
}
