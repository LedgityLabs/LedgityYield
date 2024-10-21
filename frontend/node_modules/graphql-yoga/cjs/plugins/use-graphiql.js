"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGraphiQL = void 0;
exports.shouldRenderGraphiQL = shouldRenderGraphiQL;
exports.useGraphiQL = useGraphiQL;
const tslib_1 = require("tslib");
const graphiql_html_js_1 = tslib_1.__importDefault(require("../graphiql-html.js"));
function shouldRenderGraphiQL({ headers, method }) {
    return method === 'GET' && !!headers?.get('accept')?.includes('text/html');
}
const renderGraphiQL = (opts) => graphiql_html_js_1.default
    .replace('__TITLE__', opts?.title || 'Yoga GraphiQL')
    .replace('__OPTS__', JSON.stringify(opts ?? {}));
exports.renderGraphiQL = renderGraphiQL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useGraphiQL(config) {
    const logger = config.logger ?? console;
    let graphiqlOptionsFactory;
    if (typeof config?.options === 'function') {
        graphiqlOptionsFactory = config?.options;
    }
    else if (typeof config?.options === 'object') {
        graphiqlOptionsFactory = () => config?.options;
    }
    else if (config?.options === false) {
        graphiqlOptionsFactory = () => false;
    }
    else {
        graphiqlOptionsFactory = () => ({});
    }
    const renderer = config?.render ?? exports.renderGraphiQL;
    let urlPattern;
    const getUrlPattern = ({ URLPattern }) => {
        urlPattern ||= new URLPattern({
            pathname: config.graphqlEndpoint,
        });
        return urlPattern;
    };
    return {
        async onRequest({ request, serverContext, fetchAPI, endResponse, url }) {
            if (shouldRenderGraphiQL(request) &&
                (request.url.endsWith(config.graphqlEndpoint) ||
                    request.url.endsWith(`${config.graphqlEndpoint}/`) ||
                    url.pathname === config.graphqlEndpoint ||
                    url.pathname === `${config.graphqlEndpoint}/` ||
                    getUrlPattern(fetchAPI).test(url))) {
                logger.debug(`Rendering GraphiQL`);
                const graphiqlOptions = await graphiqlOptionsFactory(request, serverContext);
                if (graphiqlOptions) {
                    const graphiQLBody = await renderer({
                        ...(graphiqlOptions === true ? {} : graphiqlOptions),
                    });
                    const response = new fetchAPI.Response(graphiQLBody, {
                        headers: {
                            'Content-Type': 'text/html',
                        },
                        status: 200,
                    });
                    endResponse(response);
                }
            }
        },
    };
}
