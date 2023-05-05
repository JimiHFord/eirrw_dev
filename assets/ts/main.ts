import Alpine from 'alpinejs'

import { ready } from './utils';
import BookList from './bookList';
import BookAdd from './bookAdd';

ready(function () {
    switch(window.location.pathname) {
        case '/books/': 
            let bookList = new BookList;
            bookList.init();
            break;
        case '/secure/books/add/':
            let bookAdd = new BookAdd;
            bookAdd.init();
            break;
    }

    Alpine.start();
});
