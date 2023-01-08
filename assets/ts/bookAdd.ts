import $ from 'jquery';

const SELECTORS = {
        form: $('#addBookForm') as JQuery<HTMLFormElement>,
        newAuthor: $('#new-author') as JQuery<HTMLInputElement>,
        newAuthorSection: $('#new-author-section'),
        newSeries: $('#new-series') as JQuery<HTMLInputElement>,
        newSeriesSection: $('#new-series-section'),
        authorSelect: $('#author-select'),
        seriesSelect: $('#series'),
    }

export default class BookAdd {
    init() {
        SELECTORS.authorSelect.select2({
            placeholder: 'Select an Author',
        });

        SELECTORS.newAuthor.on('change', function() {
            if (this.checked) {
                SELECTORS.newAuthorSection.removeClass('hidden');
                SELECTORS.authorSelect.prop('disabled', true);
            } else {
                SELECTORS.newAuthorSection.addClass('hidden');
                SELECTORS.authorSelect.prop('disabled', false);
            }
        });

        SELECTORS.newSeries.on('change', function() {
            if (this.checked) {
                SELECTORS.newSeriesSection.removeClass('hidden');
                SELECTORS.seriesSelect.prop('disabled', true);
            } else {
                SELECTORS.newSeriesSection.addClass('hidden');
                SELECTORS.seriesSelect.prop('disabled', false);
            }
        });

        SELECTORS.form.on('submit', function(event) {
            event.preventDefault();

            const data = new FormData(this);

            console.log(data);
        });
    }
}
