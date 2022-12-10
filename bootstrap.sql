DROP TABLE IF EXISTS user;
CREATE TABLE user (
    userId INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
);

DROP TABLE IF EXISTS session;
CREATE TABLE session (
    userId INT,
    sessionId TEXT,
    expires INT,
    PRIMARY KEY (`userId`, `sessionId`),
    FOREIGN KEY (`userId`) REFERENCES user(`userId`)
);

DROP TABLE IF EXISTS book;
CREATE TABLE book (
    bookId INTEGER PRIMARY KEY,
    title TEXT,
    releaseDate TEXT,
    addedDate TEXT,
    readDate TEXT
);

DROP TABLE IF EXISTS author;
CREATE TABLE author (
    authorId INTEGER PRIMARY KEY,
    lastName TEXT,
    firstName TEXT
);

DROP TABLE IF EXISTS authorBook;
create TABLE authorBook (
    authorId INT,
    bookId INT,
    PRIMARY KEY (`authorId`, `bookId`),
    FOREIGN KEY (`authorId`) REFERENCES author(`authorId`),
    FOREIGN KEY (`bookId`) REFERENCES book(`bookId`)
);

DROP TABLE IF EXISTS series;
CREATE TABLE series (
    seriesId INTEGER PRIMARY KEY,
    name TEXT
);

DROP TABLE IF EXISTS seriesBook;
CREATE TABLE seriesBook (
    seriesId INT,
    bookId INT,
    entry INT,
    PRIMARY KEY (`seriesId`, `bookId`),
    FOREIGN KEY (`seriesId`) REFERENCES series(`seriesId`),
    FOREIGN KEY (`bookId`) REFERENCES book(`bookId`)
);


-- TEST DATA
INSERT INTO
    author (authorId, lastName, firstName)
    VALUES (1, 'wilson', 'erik');

INSERT INTO
    book (bookId, title, releaseDate, addedDate, readDate)
    VALUES (1, 'this is a book', '2022-12-08', '2022-12-09', '2022-12-09');

INSERT INTO
    authorBook (authorId, bookId)
    VALUES (1, 1);
