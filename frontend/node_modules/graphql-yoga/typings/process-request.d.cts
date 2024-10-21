import { GetEnvelopedFn } from '@envelop/core';
import { ServerAdapterInitialContext } from '@whatwg-node/server';
import { OnResultProcess, ResultProcessorInput } from './plugins/types.cjs';
import { FetchAPI, GraphQLParams } from './types.cjs';
export declare function processResult<TServerContext>({ request, result, fetchAPI, onResultProcessHooks, serverContext, }: {
    request: Request;
    result: ResultProcessorInput;
    fetchAPI: FetchAPI;
    /**
     * Response Hooks
     */
    onResultProcessHooks: OnResultProcess<TServerContext>[];
    serverContext: TServerContext & ServerAdapterInitialContext;
}): Promise<Response>;
export declare function processRequest({ params, enveloped, }: {
    params: GraphQLParams;
    enveloped: ReturnType<GetEnvelopedFn<unknown>>;
}): Promise<any>;
