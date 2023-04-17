import type { AuthorData } from "assets/ts/types";

interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const ps: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        SELECT
            a.authorId as id,
            a.lastName,
            a.firstName
        FROM author a
        ORDER BY a.lastName COLLATE NOCASE, a.firstName COLLATE NOCASE;
    `);

    const data: D1Result<AuthorData> = await ps.all();

    return new Response(JSON.stringify(data.results));
}
