import { ExecutionResult } from 'graphql';
import { GetEnvelopedFn, PromiseOrValue } from '@envelop/core';
import { LogLevel, YogaLogger } from '@graphql-yoga/logger';
import { ServerAdapter, ServerAdapterBaseObject, ServerAdapterRequestHandler, useCORS } from '@whatwg-node/server';
import { Plugin } from './plugins/types.js';
import { GraphiQLOptions, GraphiQLOptionsOrFactory } from './plugins/use-graphiql.js';
import { ParserAndValidationCacheOptions } from './plugins/use-parser-and-validation-cache.js';
import { YogaSchemaDefinition } from './plugins/use-schema.js';
import { LandingPageRenderer } from './plugins/use-unhandled-route.js';
import { FetchAPI, GraphQLParams, YogaInitialContext, YogaMaskedErrorOpts } from './types.js';
/**
 * Configuration options for the server
 */
export type YogaServerOptions<TServerContext, TUserContext> = {
    /**
     * Enable/disable logging or provide a custom logger.
     * @default true
     */
    logging?: boolean | YogaLogger | LogLevel | undefined;
    /**
     * Prevent leaking unexpected errors to the client. We highly recommend enabling this in production.
     * If you throw `EnvelopError`/`GraphQLError` within your GraphQL resolvers then that error will be sent back to the client.
     *
     * You can lean more about this here:
     * @see https://graphql-yoga.vercel.app/docs/features/error-masking
     *
     * @default true
     */
    maskedErrors?: boolean | Partial<YogaMaskedErrorOpts> | undefined;
    /**
     * Context
     */
    context?: ((initialContext: YogaInitialContext & TServerContext) => Promise<TUserContext> | TUserContext) | Promise<TUserContext> | TUserContext | undefined;
    cors?: Parameters<typeof useCORS>[0] | undefined;
    /**
     * GraphQL endpoint
     * So you need to define it explicitly if GraphQL API lives in a different path other than `/graphql`
     *
     * @default "/graphql"
     */
    graphqlEndpoint?: string | undefined;
    /**
     * Readiness check endpoint
     *
     * @default "/health"
     */
    healthCheckEndpoint?: string | undefined;
    /**
     * Whether the landing page should be shown.
     */
    landingPage?: boolean | LandingPageRenderer | undefined;
    /**
     * GraphiQL options
     *
     * @default true
     */
    graphiql?: GraphiQLOptionsOrFactory<TServerContext> | undefined;
    renderGraphiQL?: ((options?: GraphiQLOptions) => PromiseOrValue<BodyInit>) | undefined;
    schema?: YogaSchemaDefinition<TServerContext, TUserContext> | undefined;
    /**
     * Envelop Plugins
     * @see https://envelop.dev/plugins
     */
    plugins?: Array<Plugin<TUserContext & TServerContext & YogaInitialContext> | Plugin | {}> | undefined;
    parserAndValidationCache?: boolean | ParserAndValidationCacheOptions | undefined;
    fetchAPI?: Partial<Record<keyof FetchAPI, any>> | undefined;
    /**
     * GraphQL Multipart Request spec support
     *
     * @see https://github.com/jaydenseric/graphql-multipart-request-spec
     *
     * @default true
     */
    multipart?: boolean | undefined;
    id?: string | undefined;
    /**
     * Batching RFC Support configuration
     *
     * @see https://github.com/graphql/graphql-over-http/blob/main/rfcs/Batching.md
     *
     * @default false
     */
    batching?: BatchingOptions | undefined;
    /**
     * By default, GraphQL Yoga does not allow parameters in the request body except `query`, `variables`, `extensions`, and `operationName`.
     *
     * This option allows you to specify additional parameters that are allowed in the request body.
     *
     * @default []
     *
     * @example ['doc_id', 'id']
     */
    extraParamNames?: string[] | undefined;
};
export type BatchingOptions = boolean | {
    /**
     * You can limit the number of batched operations per request.
     *
     * @default 10
     */
    limit?: number;
};
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
export declare class YogaServer<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>> implements ServerAdapterBaseObject<TServerContext> {
    /**
     * Instance of envelop
     */
    readonly getEnveloped: GetEnvelopedFn<TUserContext & TServerContext & YogaInitialContext>;
    logger: YogaLogger;
    readonly graphqlEndpoint: string;
    fetchAPI: FetchAPI;
    protected plugins: Array<Plugin<TUserContext & TServerContext & YogaInitialContext, TServerContext, TUserContext>>;
    private onRequestParseHooks;
    private onParamsHooks;
    private onExecutionResultHooks;
    private onResultProcessHooks;
    private maskedErrorsOpts;
    private id;
    constructor(options?: YogaServerOptions<TServerContext, TUserContext>);
    getResultForParams({ params, request, batched, }: {
        params: GraphQLParams;
        request: Request;
        batched: boolean;
    }, serverContext: TServerContext): Promise<ExecutionResult<import("graphql/jsutils/ObjMap.js").ObjMap<unknown>, import("graphql/jsutils/ObjMap.js").ObjMap<unknown>> | AsyncIterable<ExecutionResult<import("graphql/jsutils/ObjMap.js").ObjMap<unknown>, import("graphql/jsutils/ObjMap.js").ObjMap<unknown>>> | undefined>;
    handle: ServerAdapterRequestHandler<TServerContext>;
}
export type YogaServerInstance<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>> = ServerAdapter<TServerContext, YogaServer<TServerContext, TUserContext>>;
export declare function createYoga<TServerContext extends Record<string, any> = {}, TUserContext extends Record<string, any> = {}>(options: YogaServerOptions<TServerContext, TUserContext>): YogaServerInstance<TServerContext, TUserContext>;
