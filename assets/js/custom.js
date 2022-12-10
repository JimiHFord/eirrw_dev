$(document).ready( function () {
    $('#book-table').DataTable({
        ajax: {
            url: "/api/books",
            dataSrc: 'results'
        },
        columns: [
            { data: 'title' },
            { data: 'author' },
            { data: 'release' },
            { data: 'added' },
            { data: 'read' }
        ],
        paging: false,
        searching: false,
        info: false
    });
} );
