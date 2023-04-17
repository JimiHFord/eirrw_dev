import { ready } from './utils';
import bookList from './bookList';
import BookAdd from './bookAdd';


ready(function () {
    bookList();

    let bookAdd = new BookAdd;
    bookAdd.init();
});
