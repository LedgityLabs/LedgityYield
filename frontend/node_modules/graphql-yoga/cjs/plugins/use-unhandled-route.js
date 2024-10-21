"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenderLandingPage = void 0;
exports.useUnhandledRoute = useUnhandledRoute;
const tslib_1 = require("tslib");
const utils_1 = require("@graphql-tools/utils");
const landing_page_html_js_1 = tslib_1.__importDefault(require("../landing-page-html.js"));
const defaultRenderLandingPage = function defaultRenderLandingPage(opts) {
    return new opts.fetchAPI.Response(landing_page_html_js_1.default
        .replace(/__GRAPHIQL_LINK__/g, opts.graphqlEndpoint)
        .replace(/__REQUEST_PATH__/g, opts.url.pathname), {
        status: 200,
        statusText: 'OK',
        headers: {
            'Content-Type': 'text/html',
        },
    });
};
exports.defaultRenderLandingPage = defaultRenderLandingPage;
function useUnhandledRoute(args) {
    let urlPattern;
    function getUrlPattern({ URLPattern }) {
        urlPattern ||= new URLPattern({
            pathname: args.graphqlEndpoint,
        });
        return urlPattern;
    }
    const landingPageRenderer = args.landingPageRenderer || exports.defaultRenderLandingPage;
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
                    if ((0, utils_1.isPromise)(landingPage$)) {
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
