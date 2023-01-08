import $ from 'jquery';
import bookList from './bookList';
import BookAdd from './bookAdd';

$(function () {
    bookList();

    let bookAdd = new BookAdd;
    bookAdd.init();
});
