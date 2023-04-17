import { NewBookData } from "assets/ts/types";

interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const bookData: NewBookData = await context.request.json()

    // add new book
    let stmt: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        INSERT INTO book (title, releaseDate, readDate, recommend)
        VALUES (?, ?, ?, ?);
    `).bind(bookData.title, bookData.release, bookData.readDate, (bookData.recommend ? 1 : 0));
    const bookId = (await stmt.run()).meta.last_row_id;

    // link authors
    stmt = context.env.D1_EIRRW.prepare(`
        INSERT INTO authorBook (authorId, bookId) VALUES (?, ?);
    `);
    bookData.authors.forEach(authorId => {
        stmt.bind(authorId, bookId).run()
    });

    // link series
    if (bookData.series !== null) {
        stmt = context.env.D1_EIRRW.prepare(`
            INSERT INTO seriesBook (seriesId, bookId, entry) VALUES (?, ?, ?);
        `).bind(bookData.series, bookId, bookData.seriesEntry);
    }

    return new Response(null, {status: 204});
}
