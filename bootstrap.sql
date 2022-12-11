-- drop existing tables in consistent order (prevent foreign key failures)
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS authorBook;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS seriesBook;
DROP TABLE IF EXISTS series;


-- create new tables
CREATE TABLE user (
    userId INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE session (
    userId INT NOT NULL,
    sessionId TEXT NOT NULL,
    expires INT,
    PRIMARY KEY (`userId`, `sessionId`),
    FOREIGN KEY (`userId`) REFERENCES user(`userId`)
);

CREATE TABLE book (
    bookId INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    releaseDate TEXT,
    addedDate TEXT DEFAULT CURRENT_DATE,
    readDate TEXT,
    recommend BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE author (
    authorId INTEGER PRIMARY KEY,
    lastName TEXT,
    firstName TEXT
);

create TABLE authorBook (
    authorId INT NOT NULL,
    bookId INT NOT NULL,
    PRIMARY KEY (`authorId`, `bookId`),
    FOREIGN KEY (`authorId`) REFERENCES author(`authorId`),
    FOREIGN KEY (`bookId`) REFERENCES book(`bookId`)
);

CREATE TABLE series (
    seriesId INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    recommend BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE seriesBook (
    seriesId INT NOT NULL,
    bookId INT NOT NULL,
    entry INT,
    PRIMARY KEY (`seriesId`, `bookId`),
    FOREIGN KEY (`seriesId`) REFERENCES series(`seriesId`),
    FOREIGN KEY (`bookId`) REFERENCES book(`bookId`)
);
