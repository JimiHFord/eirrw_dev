import type { AuthorData } from "assets/ts/types";

interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const author: AuthorData = await context.request.json()

    let ps: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        INSERT INTO author (firstName, lastName) VALUES (?, ?);
    `).bind(author.firstName, author.lastName);
    const result: D1Result<any> = await ps.run();

    author.id = result.meta.last_row_id;

    return new Response(JSON.stringify(author), {status: 201});
}
