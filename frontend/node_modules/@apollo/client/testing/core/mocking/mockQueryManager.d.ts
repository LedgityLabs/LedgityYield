import type { QueryManagerOptions } from "../../../core/QueryManager.js";
import { QueryManager } from "../../../core/QueryManager.js";
import type { MockedResponse } from "./mockLink.js";
import { LocalState } from "../../../core/LocalState.js";
export declare const getDefaultOptionsForQueryManagerTests: <TStore>(options: Pick<QueryManagerOptions<TStore>, "cache" | "link"> & Partial<QueryManagerOptions<TStore>>) => {
    cache: import("../../../cache/index.js").ApolloCache<TStore>;
    link: import("../../../index.js").ApolloLink;
    defaultOptions: any;
    documentTransform: import("../../../index.js").DocumentTransform | null | undefined;
    queryDeduplication: boolean;
    onBroadcast: undefined | (() => void);
    ssrMode: boolean;
    clientAwareness: Record<string, string>;
    localState: LocalState<TStore>;
    assumeImmutableResults: boolean;
    defaultContext: Partial<import("../../../index.js").DefaultContext> | undefined;
};
declare const _default: (...mockedResponses: MockedResponse[]) => QueryManager<import("../../../cache/index.js").NormalizedCacheObject>;
export default _default;
//# sourceMappingURL=mockQueryManager.d.ts.map