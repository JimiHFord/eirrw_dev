import $ from 'jquery';
import TomSelect from 'tom-select';
import { TomLoadCallback, TomOption } from 'tom-select/dist/types/types';
import { escape_html } from 'tom-select/dist/types/utils';
import { AuthorData, NewBookData, SeriesData } from './types';

const SELECTORS = {
    form: $('#addBookForm') as JQuery<HTMLFormElement>,
    authorSelect: $('#author-select'),
    seriesSelect: $('#series'),
    authorAddButton: $('#new-author'),
    authorAddModal: $('#modal-add-author'),
    authorAddModalSubmit: $('#modal-add-author-btn-submit'),
    authorAddModalCancel: $('#modal-add-author-btn-cancel'),
    seriesAddButton: $('#new-series'),
    seriesAddModal: $('#modal-add-series'),
    seriesAddModalSubmit: $('#modal-add-series-btn-submit'),
    seriesAddModalCancel: $('#modal-add-series-btn-cancel'),
}

export default class BookAdd {
    authorSelect: TomSelect;
    seriesSelect: TomSelect;

    public init() {
        this.authorSelect = new TomSelect('#author-select', {
            plugins: {
                remove_button: {
                    title: 'Remove',
                },
            },
            controlClass: 'ts-control mt-1 w-full rounded-md shadow-sm bg-neutral-100 dark:bg-neutral-700 border-1 border-neutral-600 focus:ring-primary-600 focus:border-primary-600',
            closeAfterSelect: true,
            valueField: 'id',
            searchField: ['firstName', 'lastName'],
            preload: true,
            load: function(query: string, callback: TomLoadCallback) {
                const self = this;
                if (self.loading > 1) {
                    callback([], []);
                    return;
                }

                const url = '/api/books/authors'
                fetch(url)
                    .then(response => response.json())
                    .then((authors: AuthorData[]) => {
                        callback(authors, authors);
                        self.settings.load = null;
                    }).catch(() => {
                        callback([], [])
                    });

            },
            render: {
                option: function(data: AuthorData, escape: typeof escape_html) {
                    return '<div>' + escape(data.lastName) + ', ' + escape(data.firstName) + '</div>';
                },
                item: function(data: AuthorData, escape: typeof escape_html) {
                    return '<div>' + escape(data.lastName) + ', ' + escape(data.firstName) + '</div>';
                },
            }
        });

        const blankOption = { id: '', name: 'None', recommend: false };
        this.seriesSelect = new TomSelect('#series', {
            allowEmptyOption: true,
            controlClass: 'ts-control mt-1 w-full rounded-md shadow-sm bg-neutral-100 dark:bg-neutral-700 border-1 border-neutral-600 focus:ring-primary-600 focus:border-primary-600',
            valueField: 'id',
            searchField: ['name'],
            preload: true,
            options: [ blankOption ],
            load: function(query: string, callback: TomLoadCallback) {
                const self = this;
                if (self.loading > 1) {
                    callback([], []);
                    return;
                }

                fetch('/api/books/series')
                    .then(response => response.json())
                    .then((series: SeriesData[]) => {
                        callback(series, series);
                        self.settings.load = null;
                    })
                    .catch(() => {
                        callback([], []);
                    });
            },
            render: {
                option: function(data: SeriesData, escape: typeof escape_html) {
                    return '<div>' + escape(data.name) + '</div>';
                },
                item: function(data: SeriesData, escape: typeof escape_html) {
                    return '<div>' + escape(data.name) + '</div>';
                },
            }
        });

        // add new author
        SELECTORS.authorAddButton.on('click', (e) => {
            SELECTORS.authorAddModal.removeClass('hide')
            SELECTORS.authorAddModal.addClass('show')
            SELECTORS.authorAddModal.find('input').val('')
        });
        SELECTORS.authorAddModalCancel.on('click', (e) => {
            this.handleAuthorModalClose();
        });
        SELECTORS.authorAddModalSubmit.on('click', (e) => {
            const self = this;
            const formdata = SELECTORS.authorAddModal.find('form').serializeArray();
            const authorData = {
                firstName: formdata[0].value,
                lastName: formdata[1].value,
            }

            fetch('/secure/api/books/author', {
                method: 'POST',
                body: JSON.stringify(authorData)
            })
                .then(response => response.json())
                .then(json => {
                    self.authorSelect.addOption(json);
                })
                .finally(() => self.handleAuthorModalClose());
        });

        // add new series
        SELECTORS.seriesAddButton.on('click', (e) => {
            SELECTORS.seriesAddModal.removeClass('hide')
            SELECTORS.seriesAddModal.addClass('show')
            SELECTORS.seriesAddModal.find('input').val('')
        });
        SELECTORS.seriesAddModalCancel.on('click', (e) => {
            this.handleSeriesModalClose()
        });
        SELECTORS.seriesAddModalSubmit.on('click', (e) => {
            const self = this;
            const formdata = SELECTORS.seriesAddModal.find('form').serializeArray();
            const series = {
                name: formdata[0].value,
                recommend: (formdata[1]?.value === ''),
            }

            fetch('/secure/api/books/series', {
                method: 'POST',
                body: JSON.stringify(series)
            })
                .then(response => response.json())
                .then((json: SeriesData) => {
                    self.seriesSelect.addOption(json);
                    self.seriesSelect.addItem(`${json.id}`);
                })
                .finally(() => self.handleSeriesModalClose());
        });

        // submit new book
        SELECTORS.form.on('submit', this.handleFormSubmit);
    }

    private handleAuthorModalClose() {
        SELECTORS.authorAddModal.removeClass('show')
        SELECTORS.authorAddModal.addClass('hide')
    }

    private handleSeriesModalClose() {
        SELECTORS.seriesAddModal.removeClass('show')
        SELECTORS.seriesAddModal.addClass('hide')
    }

    private handleFormSubmit(event: JQuery.TriggeredEvent) {
        event.preventDefault();
        const $form = $(this);
        const formdata = $form.serializeArray()

        console.log(formdata);

        const data: NewBookData = {
            title: formdata.find(item => item.name === 'title').value,
            release: formdata.find(item => item.name === 'release').value,
            readDate: formdata.find(item => item.name === 'readDate').value || null,
            authors: formdata.filter(item => item.name === 'author-select').map(x => parseInt(x.value)),
            recommend: $form.find('#recommend').is(':checked'),
            series: parseInt(formdata.find(i => i.name === 'series').value) || null,
            seriesEntry: parseInt(formdata.find(i => i.name === 'series-entry').value) || null,
        }

        console.log(data);

        fetch('/secure/api/books', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}
