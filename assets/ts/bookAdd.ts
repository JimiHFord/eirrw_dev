import $ from 'jquery';

interface BookForm {
    title: string;
    release: string;
    readDate?: string;
    authors: {
        firstName: string,
        lastName: string
    }[] | string[];
    series?: number;
    seriesEntry?: number;
    newSeries?: string;
    recommend: {
        book: boolean
        series: boolean
    }
}

const SELECTORS = {
    form: $('#addBookForm') as JQuery<HTMLFormElement>,
    newSeries: $('#new-series') as JQuery<HTMLInputElement>,
    newSeriesSection: $('#new-series-section'),
    authorSelect: $('#author-select'),
    seriesSelect: $('#series'),
    authorAddButton: $('#new-author'),
    authorAddModal: $('#modal-add-author'),
    authorAddModalBackdrop: $('#modal-add-author-backdrop'),
    authorAddModalContent: $('#modal-add-author-content'),
}

export default class BookAdd {
    public init() {
        SELECTORS.authorSelect.selectize({
            plugins: ['remove_button'],
            closeAfterSelect: true,
            placeholder: 'Select author...',
            load: () => {

            }
        });

        SELECTORS.seriesSelect.selectize({
            placeholder: 'Select series...',
            allowEmptyOption: true,
            showEmptyOptionInDropdown: true,
            load: () => {
            }
        })

        SELECTORS.authorAddButton.on('click', this.handleNewAuthor);

        SELECTORS.newSeries.on('change', this.handleNewSeries);

        SELECTORS.form.on('submit', this.handleFormSubmit);
    }

    private handleNewAuthor(event: JQuery.TriggeredEvent) {
        SELECTORS.authorAddModal.fadeIn()
    }

    private handleNewSeries(event: JQuery.TriggeredEvent) {
        if (event.currentTarget.checked) {
            SELECTORS.newSeriesSection.removeClass('hidden');
            SELECTORS.seriesSelect[0].selectize.disable();
        } else {
            SELECTORS.newSeriesSection.addClass('hidden');
            SELECTORS.seriesSelect[0].selectize.enable();
        }
    }

    private handleFormSubmit(event: JQuery.TriggeredEvent) {
        event.preventDefault();
        const $form = $(this);

        const data: BookForm = {
            title: $form.find('#title').val() as string,
            release: $form.find('#release').val() as string,
            readDate: $form.find('#readDate').val() as string ?? null,
            authors: $form.find('#author-select').val() as string[],
            series: $form.find('#series').val() as number,
            seriesEntry: $form.find('#series-entry').val() as number,
            recommend: {
                book: $form.find('#recommend').is(':checked'),
                series: $form.find('#series-rec').is(':checked'),
            }
        }

        console.log(data);
    }
}
