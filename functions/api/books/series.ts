import type { SeriesData } from 'assets/ts/types';

interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const ps: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        SELECT seriesId as id, name, recommend
        FROM series
        ORDER BY name COLLATE NOCASE;
    `);

    const data: D1Result<SeriesData> = await ps.all();

    return new Response(JSON.stringify(data.results));
}
