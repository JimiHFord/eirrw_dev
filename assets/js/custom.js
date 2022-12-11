$(document).ready( function () {
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
            { 
                data: 'series',
                render: (data, _, row) => 
                    data ? `<span class="${row.recommendSeries ? 'font-semibold' : ''}">${data}</span> ` +
                        `(${row.seriesEntry})`
                    : ''
            },
        ],
        rowGroup: {
            dataSrc: row => row.read == null ? "TBR" : "Read"
        },
        paging: false,
        searching: false,
        info: false,
        order: [ 5, 'desc' ],
        scrollX: false
    } );
} );
