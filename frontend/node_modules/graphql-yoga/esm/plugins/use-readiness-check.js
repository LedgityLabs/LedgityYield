/**
 * Adds a readiness check for Yoga by simply implementing the `check` option.
 */
export function useReadinessCheck({ endpoint = '/ready', check, }) {
    let urlPattern;
    return {
        onYogaInit({ yoga }) {
            urlPattern = new yoga.fetchAPI.URLPattern({ pathname: endpoint });
        },
        async onRequest({ request, endResponse, fetchAPI, url }) {
            if (request.url.endsWith(endpoint) || url.pathname === endpoint || urlPattern.test(url)) {
                let response;
                try {
                    const readyOrResponse = await check({ request, fetchAPI });
                    if (typeof readyOrResponse === 'object') {
                        response = readyOrResponse;
                    }
                    else {
                        response = new fetchAPI.Response(null, {
                            status: readyOrResponse === false ? 503 : 200,
                        });
                    }
                }
                catch (err) {
                    const isError = err instanceof Error;
                    response = new fetchAPI.Response(isError ? err.message : null, {
                        status: 503,
                        headers: isError ? { 'content-type': 'text/plain; charset=utf-8' } : {},
                    });
                }
                endResponse(response);
            }
        },
    };
}
