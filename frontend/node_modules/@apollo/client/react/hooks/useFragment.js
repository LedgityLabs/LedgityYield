import { __assign, __rest } from "tslib";
import * as React from "rehackt";
import { mergeDeepArray } from "../../utilities/index.js";
import { useApolloClient } from "./useApolloClient.js";
import { useSyncExternalStore } from "./useSyncExternalStore.js";
import { useDeepMemo, wrapHook } from "./internal/index.js";
import equal from "@wry/equality";
export function useFragment(options) {
    return wrapHook("useFragment", _useFragment, useApolloClient(options.client))(options);
}
function _useFragment(options) {
    var cache = useApolloClient(options.client).cache;
    var from = options.from, rest = __rest(options, ["from"]);
    // We calculate the cache id seperately from `stableOptions` because we don't
    // want changes to non key fields in the `from` property to affect
    // `stableOptions` and retrigger our subscription. If the cache identifier
    // stays the same between renders, we want to reuse the existing subscription.
    var id = React.useMemo(function () { return (typeof from === "string" ? from : cache.identify(from)); }, [cache, from]);
    var stableOptions = useDeepMemo(function () { return (__assign(__assign({}, rest), { from: id })); }, [rest, id]);
    // Since .next is async, we need to make sure that we
    // get the correct diff on the next render given new diffOptions
    var diff = React.useMemo(function () {
        var fragment = stableOptions.fragment, fragmentName = stableOptions.fragmentName, from = stableOptions.from, _a = stableOptions.optimistic, optimistic = _a === void 0 ? true : _a;
        return {
            result: diffToResult(cache.diff(__assign(__assign({}, stableOptions), { returnPartialData: true, id: from, query: cache["getFragmentDoc"](fragment, fragmentName), optimistic: optimistic }))),
        };
    }, [stableOptions, cache]);
    // Used for both getSnapshot and getServerSnapshot
    var getSnapshot = React.useCallback(function () { return diff.result; }, [diff]);
    return useSyncExternalStore(React.useCallback(function (forceUpdate) {
        var lastTimeout = 0;
        var subscription = cache.watchFragment(stableOptions).subscribe({
            next: function (result) {
                // Since `next` is called async by zen-observable, we want to avoid
                // unnecessarily rerendering this hook for the initial result
                // emitted from watchFragment which should be equal to
                // `diff.result`.
                if (equal(result, diff.result))
                    return;
                diff.result = result;
                // If we get another update before we've re-rendered, bail out of
                // the update and try again. This ensures that the relative timing
                // between useQuery and useFragment stays roughly the same as
                // fixed in https://github.com/apollographql/apollo-client/pull/11083
                clearTimeout(lastTimeout);
                lastTimeout = setTimeout(forceUpdate);
            },
        });
        return function () {
            subscription.unsubscribe();
            clearTimeout(lastTimeout);
        };
    }, [cache, stableOptions, diff]), getSnapshot, getSnapshot);
}
function diffToResult(diff) {
    var result = {
        data: diff.result,
        complete: !!diff.complete,
    };
    if (diff.missing) {
        result.missing = mergeDeepArray(diff.missing.map(function (error) { return error.missing; }));
    }
    return result;
}
//# sourceMappingURL=useFragment.js.map