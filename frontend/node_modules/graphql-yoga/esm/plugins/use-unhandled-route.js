import { isPromise } from '@graphql-tools/utils';
import landingPageBody from '../landing-page-html.js';
export const defaultRenderLandingPage = function defaultRenderLandingPage(opts) {
    return new opts.fetchAPI.Response(landingPageBody
        .replace(/__GRAPHIQL_LINK__/g, opts.graphqlEndpoint)
        .replace(/__REQUEST_PATH__/g, opts.url.pathname), {
        status: 200,
        statusText: 'OK',
        headers: {
            'Content-Type': 'text/html',
        },
    });
};
export function useUnhandledRoute(args) {
    let urlPattern;
    function getUrlPattern({ URLPattern }) {
        urlPattern ||= new URLPattern({
            pathname: args.graphqlEndpoint,
        });
        return urlPattern;
    }
    const landingPageRenderer = args.landingPageRenderer || defaultRenderLandingPage;
    return {
        onRequest({ request, fetchAPI, endResponse, url }) {
            if (!request.url.endsWith(args.graphqlEndpoint) &&
                !request.url.endsWith(`${args.graphqlEndpoint}/`) &&
                url.pathname !== args.graphqlEndpoint &&
                url.pathname !== `${args.graphqlEndpoint}/` &&
                !getUrlPattern(fetchAPI).test(url)) {
                if (args.showLandingPage === true &&
                    request.method === 'GET' &&
                    !!request.headers?.get('accept')?.includes('text/html')) {
                    const landingPage$ = landingPageRenderer({
                        request,
                        fetchAPI,
                        url,
                        graphqlEndpoint: args.graphqlEndpoint,
                        get urlPattern() {
                            return getUrlPattern(fetchAPI);
                        },
                    });
                    if (isPromise(landingPage$)) {
                        return landingPage$.then(endResponse);
                    }
                    endResponse(landingPage$);
                    return;
                }
                endResponse(new fetchAPI.Response('', {
                    status: 404,
                    statusText: 'Not Found',
                }));
            }
        },
    };
}
