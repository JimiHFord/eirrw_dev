import { SeriesData } from "assets/ts/types";

interface Env {
    D1_EIRRW: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const series: SeriesData = await context.request.json()
    console.log(series)

    let ps: D1PreparedStatement = context.env.D1_EIRRW.prepare(`
        INSERT INTO series (name, recommend) VALUES (?, ?);
    `).bind(series.name, series.recommend ? 1 : 0);

    const result: D1Result<any> = await ps.run();

    series.id = result.meta.last_row_id;

    return new Response(JSON.stringify(series), {status: 201});
}
