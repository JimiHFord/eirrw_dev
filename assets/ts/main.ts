import $ from 'jquery';
import bookList from './bookList';

$(function () {
    bookList();

   $('#new-author').on('change', function() {
      if (this.checked) {
          $('#new-author-section').removeClass('hidden');
      } else {
          $('#new-author-section').addClass('hidden');
      }
  });
});
