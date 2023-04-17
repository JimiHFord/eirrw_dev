interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const ps: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        select
            b.title as title,
            a.lastName as authorLast,
            a.firstName as authorFirst,
            b.releaseDate as release,
            b.addedDate as added,
            b.readDate as read,
            CASE WHEN b.readDate IS NULL THEN 0 ELSE 1 END as isRead,
            s.name as series,
            sb.entry as seriesEntry,
            b.recommend as recommendBook,
            s.recommend as recommendSeries
        from 
            book b
        left join authorBook ab
            on b.bookId = ab.bookId
        left join author a
            on a.authorId = ab.authorId
        left join seriesBook sb
            on b.bookId = sb.bookId
        left join series s
            on s.seriesId = sb.seriesId;
    `);


    const data: D1Result = await ps.all();

    return new Response(JSON.stringify(data));
}
