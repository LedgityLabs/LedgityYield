import { __assign } from "tslib";
import { QueryManager } from "../../../core/QueryManager.js";
import { mockSingleLink } from "./mockLink.js";
import { InMemoryCache } from "../../../cache/index.js";
import { LocalState } from "../../../core/LocalState.js";
export var getDefaultOptionsForQueryManagerTests = function (options) { return (__assign({ defaultOptions: Object.create(null), documentTransform: undefined, queryDeduplication: false, onBroadcast: undefined, ssrMode: false, clientAwareness: {}, localState: new LocalState({ cache: options.cache }), assumeImmutableResults: !!options.cache.assumeImmutableResults, defaultContext: undefined }, options)); };
// Helper method for the tests that construct a query manager out of a
// a list of mocked responses for a mocked network interface.
export default (function() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    return new QueryManager(getDefaultOptionsForQueryManagerTests({
        link: mockSingleLink.apply(void 0, mockedResponses),
        cache: new InMemoryCache({ addTypename: false }),
    }));
});
//# sourceMappingURL=mockQueryManager.js.map