import { ServerAdapterPlugin } from './plugins/types.cjs';
import { FetchAPI, ServerAdapter, ServerAdapterBaseObject, ServerAdapterRequestHandler } from './types.cjs';
export interface ServerAdapterOptions<TServerContext> {
    plugins?: ServerAdapterPlugin<TServerContext>[];
    fetchAPI?: Partial<FetchAPI>;
}
declare function createServerAdapter<TServerContext = {}, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>>(serverAdapterRequestHandler: THandleRequest, options?: ServerAdapterOptions<TServerContext>): ServerAdapter<TServerContext, ServerAdapterBaseObject<TServerContext, THandleRequest>>;
declare function createServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>>(serverAdapterBaseObject: TBaseObject, options?: ServerAdapterOptions<TServerContext>): ServerAdapter<TServerContext, TBaseObject>;
export { createServerAdapter };
