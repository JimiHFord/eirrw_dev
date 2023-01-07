export const onRequest: PagesFunction = async (context) => {
//    if (context.request.headers.get('x-test') == null) {
//        return new Response({}, {status: 401});
//    }

    const url = new URL(context.request.url);
    const asset = await context.env.ASSETS.fetch(url);

    console.log(url);

    return new Response(asset.body, asset);
}
