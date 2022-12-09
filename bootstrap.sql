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
