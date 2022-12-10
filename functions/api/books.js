export async function onRequestGet(context) {
    const ps = context.env.D1_EIRRW.prepare(`
        select
            b.title as title,
            a.lastName as author,
            b.releaseDate as release,
            b.addedDate as added,
            b.readDate as read
        from 
            book b
        left join authorBook ab
            on b.bookId = ab.bookId
        left join author a
            on a.authorId = ab.authorId
    `);
    const data = await ps.all();

    console.log(data);

    return Response.json(data ?? {});
}
