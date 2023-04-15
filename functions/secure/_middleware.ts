import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access";

interface Env {
    ACCESS_DOMAIN: `https://${string}.cloudflareaccess.com`;
    ACCESS_AUD: string;
    CF_PAGES: number;
}

export const onRequest: PagesFunction<Env> = (context) => {
    if (context.env.CF_PAGES === 1) {
        return cloudflareAccessPlugin({
            domain: context.env.ACCESS_DOMAIN,
            aud: context.env.ACCESS_AUD,
        })(context);
    } else {
        console.log("skipping access check");
        return context.next();
    }
};
