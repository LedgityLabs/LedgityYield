"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YogaServer = void 0;
exports.createYoga = createYoga;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const graphql_1 = require("graphql");
const core_1 = require("@envelop/core");
const executor_1 = require("@graphql-tools/executor");
const utils_1 = require("@graphql-tools/utils");
const logger_1 = require("@graphql-yoga/logger");
const defaultFetchAPI = tslib_1.__importStar(require("@whatwg-node/fetch"));
const server_1 = require("@whatwg-node/server");
const error_js_1 = require("./error.js");
const get_js_1 = require("./plugins/request-parser/get.js");
const post_form_url_encoded_js_1 = require("./plugins/request-parser/post-form-url-encoded.js");
const post_graphql_string_js_1 = require("./plugins/request-parser/post-graphql-string.js");
const post_json_js_1 = require("./plugins/request-parser/post-json.js");
const post_multipart_js_1 = require("./plugins/request-parser/post-multipart.js");
const use_check_graphql_query_params_js_1 = require("./plugins/request-validation/use-check-graphql-query-params.js");
const use_check_method_for_graphql_js_1 = require("./plugins/request-validation/use-check-method-for-graphql.js");
const use_http_validation_error_js_1 = require("./plugins/request-validation/use-http-validation-error.js");
const use_limit_batching_js_1 = require("./plugins/request-validation/use-limit-batching.js");
const use_prevent_mutation_via_get_js_1 = require("./plugins/request-validation/use-prevent-mutation-via-get.js");
const use_graphiql_js_1 = require("./plugins/use-graphiql.js");
const use_health_check_js_1 = require("./plugins/use-health-check.js");
const use_parser_and_validation_cache_js_1 = require("./plugins/use-parser-and-validation-cache.js");
const use_request_parser_js_1 = require("./plugins/use-request-parser.js");
const use_result_processor_js_1 = require("./plugins/use-result-processor.js");
const use_schema_js_1 = require("./plugins/use-schema.js");
const use_unhandled_route_js_1 = require("./plugins/use-unhandled-route.js");
const process_request_js_1 = require("./process-request.js");
const mask_error_js_1 = require("./utils/mask-error.js");
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
class YogaServer {
    /**
     * Instance of envelop
     */
    getEnveloped;
    logger;
    graphqlEndpoint;
    fetchAPI;
    plugins;
    onRequestParseHooks;
    onParamsHooks;
    onExecutionResultHooks;
    onResultProcessHooks;
    maskedErrorsOpts;
    id;
    constructor(options) {
        this.id = options?.id ?? 'yoga';
        this.fetchAPI = {
            ...defaultFetchAPI,
        };
        if (options?.fetchAPI) {
            for (const key in options.fetchAPI) {
                if (options.fetchAPI[key]) {
                    this.fetchAPI[key] = options.fetchAPI[key];
                }
            }
        }
        const logger = options?.logging == null ? true : options.logging;
        this.logger =
            typeof logger === 'boolean'
                ? logger === true
                    ? (0, logger_1.createLogger)()
                    : (0, logger_1.createLogger)('silent')
                : typeof logger === 'string'
                    ? (0, logger_1.createLogger)(logger)
                    : logger;
        const maskErrorFn = (typeof options?.maskedErrors === 'object' && options.maskedErrors.maskError) || mask_error_js_1.maskError;
        const maskedErrorSet = new WeakSet();
        this.maskedErrorsOpts =
            options?.maskedErrors === false
                ? null
                : {
                    errorMessage: 'Unexpected error.',
                    ...(typeof options?.maskedErrors === 'object' ? options.maskedErrors : {}),
                    maskError: (error, message) => {
                        if (maskedErrorSet.has(error)) {
                            return error;
                        }
                        const newError = maskErrorFn(error, message, this.maskedErrorsOpts?.isDev);
                        if (newError !== error) {
                            this.logger.error(error);
                        }
                        maskedErrorSet.add(newError);
                        return newError;
                    },
                };
        const maskedErrors = this.maskedErrorsOpts == null ? null : this.maskedErrorsOpts;
        let batchingLimit = 0;
        if (options?.batching) {
            if (typeof options.batching === 'boolean') {
                batchingLimit = 10;
            }
            else {
                batchingLimit = options.batching.limit ?? 10;
            }
        }
        this.graphqlEndpoint = options?.graphqlEndpoint || '/graphql';
        const graphqlEndpoint = this.graphqlEndpoint;
        this.plugins = [
            (0, core_1.useEngine)({
                parse: graphql_1.parse,
                validate: graphql_1.validate,
                execute: executor_1.normalizedExecutor,
                subscribe: executor_1.normalizedExecutor,
                specifiedRules: graphql_1.specifiedRules,
            }),
            // Use the schema provided by the user
            !!options?.schema && (0, use_schema_js_1.useSchema)(options.schema),
            options?.context != null &&
                (0, core_1.useExtendContext)(initialContext => {
                    if (options?.context) {
                        if (typeof options.context === 'function') {
                            return options.context(initialContext);
                        }
                        return options.context;
                    }
                    return {};
                }),
            // Middlewares before processing the incoming HTTP request
            (0, use_health_check_js_1.useHealthCheck)({
                id: this.id,
                logger: this.logger,
                endpoint: options?.healthCheckEndpoint,
            }),
            options?.cors !== false && (0, server_1.useCORS)(options?.cors),
            options?.graphiql !== false &&
                (0, use_graphiql_js_1.useGraphiQL)({
                    graphqlEndpoint,
                    options: options?.graphiql,
                    render: options?.renderGraphiQL,
                    logger: this.logger,
                }),
            // Middlewares before the GraphQL execution
            (0, use_request_parser_js_1.useRequestParser)({
                match: get_js_1.isGETRequest,
                parse: get_js_1.parseGETRequest,
            }),
            (0, use_request_parser_js_1.useRequestParser)({
                match: post_json_js_1.isPOSTJsonRequest,
                parse: post_json_js_1.parsePOSTJsonRequest,
            }),
            options?.multipart !== false &&
                (0, use_request_parser_js_1.useRequestParser)({
                    match: post_multipart_js_1.isPOSTMultipartRequest,
                    parse: post_multipart_js_1.parsePOSTMultipartRequest,
                }),
            (0, use_request_parser_js_1.useRequestParser)({
                match: post_graphql_string_js_1.isPOSTGraphQLStringRequest,
                parse: post_graphql_string_js_1.parsePOSTGraphQLStringRequest,
            }),
            (0, use_request_parser_js_1.useRequestParser)({
                match: post_form_url_encoded_js_1.isPOSTFormUrlEncodedRequest,
                parse: post_form_url_encoded_js_1.parsePOSTFormUrlEncodedRequest,
            }),
            // Middlewares after the GraphQL execution
            (0, use_result_processor_js_1.useResultProcessors)(),
            (0, server_1.useErrorHandling)((error, request, serverContext) => {
                const errors = (0, error_js_1.handleError)(error, this.maskedErrorsOpts, this.logger);
                const result = {
                    errors,
                };
                return (0, process_request_js_1.processResult)({
                    request,
                    result,
                    fetchAPI: this.fetchAPI,
                    onResultProcessHooks: this.onResultProcessHooks,
                    serverContext,
                });
            }),
            ...(options?.plugins ?? []),
            // To make sure those are called at the end
            {
                onPluginInit({ addPlugin }) {
                    if (options?.parserAndValidationCache !== false) {
                        addPlugin(
                        // @ts-expect-error Add plugins has context but this hook doesn't care
                        (0, use_parser_and_validation_cache_js_1.useParserAndValidationCache)(!options?.parserAndValidationCache || options?.parserAndValidationCache === true
                            ? {}
                            : options?.parserAndValidationCache));
                    }
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin((0, use_limit_batching_js_1.useLimitBatching)(batchingLimit));
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin((0, use_check_graphql_query_params_js_1.useCheckGraphQLQueryParams)(options?.extraParamNames));
                    const showLandingPage = !!(options?.landingPage ?? true);
                    addPlugin(
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    (0, use_unhandled_route_js_1.useUnhandledRoute)({
                        graphqlEndpoint,
                        showLandingPage,
                        landingPageRenderer: typeof options?.landingPage === 'function' ? options.landingPage : undefined,
                    }));
                    // We check the method after user-land plugins because the plugin might support more methods (like graphql-sse).
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin((0, use_check_method_for_graphql_js_1.useCheckMethodForGraphQL)());
                    // We make sure that the user doesn't send a mutation with GET
                    // @ts-expect-error Add plugins has context but this hook doesn't care
                    addPlugin((0, use_prevent_mutation_via_get_js_1.usePreventMutationViaGET)());
                    if (maskedErrors) {
                        // Make sure we always throw AbortError instead of masking it!
                        addPlugin({
                            onSubscribe() {
                                return {
                                    onSubscribeError({ error }) {
                                        if ((0, error_js_1.isAbortError)(error)) {
                                            throw error;
                                        }
                                    },
                                };
                            },
                        });
                        addPlugin((0, core_1.useMaskedErrors)(maskedErrors));
                    }
                    addPlugin(
                    // We handle validation errors at the end
                    (0, use_http_validation_error_js_1.useHTTPValidationError)());
                },
            },
        ];
        this.getEnveloped = (0, core_1.envelop)({
            plugins: this.plugins,
        });
        this.plugins = this.getEnveloped._plugins;
        this.onRequestParseHooks = [];
        this.onParamsHooks = [];
        this.onExecutionResultHooks = [];
        this.onResultProcessHooks = [];
        for (const plugin of this.plugins) {
            if (plugin) {
                if (plugin.onYogaInit) {
                    plugin.onYogaInit({
                        yoga: this,
                    });
                }
                if (plugin.onRequestParse) {
                    this.onRequestParseHooks.push(plugin.onRequestParse);
                }
                if (plugin.onParams) {
                    this.onParamsHooks.push(plugin.onParams);
                }
                if (plugin.onExecutionResult) {
                    this.onExecutionResultHooks.push(plugin.onExecutionResult);
                }
                if (plugin.onResultProcess) {
                    this.onResultProcessHooks.push(plugin.onResultProcess);
                }
            }
        }
    }
    async getResultForParams({ params, request, batched, }, serverContext) {
        let result;
        let context = serverContext;
        try {
            for (const onParamsHook of this.onParamsHooks) {
                await onParamsHook({
                    params,
                    request,
                    setParams(newParams) {
                        params = newParams;
                    },
                    setResult(newResult) {
                        result = newResult;
                    },
                    fetchAPI: this.fetchAPI,
                });
            }
            if (result == null) {
                const additionalContext = serverContext.request === request
                    ? {
                        params,
                    }
                    : {
                        request,
                        params,
                    };
                context = Object.assign(batched ? Object.create(serverContext) : serverContext, additionalContext);
                const enveloped = this.getEnveloped(context);
                this.logger.debug(`Processing GraphQL Parameters`);
                result = await (0, process_request_js_1.processRequest)({
                    params,
                    enveloped,
                });
                this.logger.debug(`Processing GraphQL Parameters done.`);
            }
            /** Ensure that error thrown from subscribe is sent to client */
            // TODO: this should probably be something people can customize via a hook?
            if ((0, core_1.isAsyncIterable)(result)) {
                const iterator = result[Symbol.asyncIterator]();
                result = (0, utils_1.mapAsyncIterator)(iterator, v => v, (err) => {
                    if (err.name === 'AbortError') {
                        this.logger.debug(`Request aborted`);
                        throw err;
                    }
                    const errors = (0, error_js_1.handleError)(err, this.maskedErrorsOpts, this.logger);
                    return {
                        errors,
                    };
                });
            }
        }
        catch (error) {
            const errors = (0, error_js_1.handleError)(error, this.maskedErrorsOpts, this.logger);
            result = {
                errors,
            };
        }
        for (const onExecutionResult of this.onExecutionResultHooks) {
            await onExecutionResult({
                result,
                setResult(newResult) {
                    result = newResult;
                },
                request,
                context,
            });
        }
        return result;
    }
    handle = async (request, serverContext) => {
        let url = new Proxy({}, {
            get: (_target, prop, _receiver) => {
                url = new this.fetchAPI.URL(request.url, 'http://localhost');
                return Reflect.get(url, prop, url);
            },
        });
        let requestParser;
        const onRequestParseDoneList = [];
        for (const onRequestParse of this.onRequestParseHooks) {
            const onRequestParseResult = await onRequestParse({
                request,
                url,
                requestParser,
                serverContext,
                setRequestParser(parser) {
                    requestParser = parser;
                },
            });
            if (onRequestParseResult?.onRequestParseDone != null) {
                onRequestParseDoneList.push(onRequestParseResult.onRequestParseDone);
            }
        }
        this.logger.debug(`Parsing request to extract GraphQL parameters`);
        if (!requestParser) {
            return new this.fetchAPI.Response(null, {
                status: 415,
                statusText: 'Unsupported Media Type',
            });
        }
        let requestParserResult = await requestParser(request);
        for (const onRequestParseDone of onRequestParseDoneList) {
            await onRequestParseDone({
                requestParserResult,
                setRequestParserResult(newParams) {
                    requestParserResult = newParams;
                },
            });
        }
        const result = (await (Array.isArray(requestParserResult)
            ? Promise.all(requestParserResult.map(params => this.getResultForParams({
                params,
                request,
                batched: true,
            }, serverContext)))
            : this.getResultForParams({
                params: requestParserResult,
                request,
                batched: false,
            }, serverContext)));
        return (0, process_request_js_1.processResult)({
            request,
            result,
            fetchAPI: this.fetchAPI,
            onResultProcessHooks: this.onResultProcessHooks,
            serverContext,
        });
    };
}
exports.YogaServer = YogaServer;
function createYoga(options) {
    const server = new YogaServer(options);
    return (0, server_1.createServerAdapter)(server, {
        fetchAPI: server.fetchAPI,
        plugins: server['plugins'],
    });
}
