export async function onRequest(context) {
    const ps = context.env.D1_EIRRW.prepare("select * from book;");
    const data = await ps.first();

    console.log(data);

    return Response.json(data ?? {});
}

