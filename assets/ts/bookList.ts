import $ from 'jquery';

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

export default function bookList() {
  $('#book-table').DataTable({
    ajax: {
      url: "/api/books",
      dataSrc: 'results'
    },
    columns: [
      {
        data: 'title',
        render: (data, _, row) => `<span class="${row.recommendBook ? 'font-semibold' : ''}">${data}</span>`
      },
      { data: 'authorLast', orderData: [ 1, 2 ] },
      { data: 'authorFirst', orderData: [ 2, 1 ] },
      { data: 'release' },
      { data: 'added' },
      { data: 'read', orderData: [ 5, 4, 1 ] },
      { data: 'isRead', visible: false },
      { 
        data: 'series',
        render: (data, _, row) => 
        data ? `<span class="${row.recommendSeries ? 'font-semibold' : ''}">${data}</span> ` +
          `(${row.seriesEntry})`
            : ''
      },
    ],
    rowGroup: {
      dataSrc: 'isRead',
      startRender: (rows, group): string => group == '1' ? `Read (${rows.count()})`  : `TBR (${rows.count()})`
    },
    paging: false,
    searching: false,
    info: false,
    order: [[6, 'desc'], [5, 'desc']],
    orderFixed: [6, 'desc'],
    scrollX: false,
    fixedHeader: true,
    responsive: true,
    autoWidth: false
  } );
};
