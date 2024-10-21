import { __assign, __rest } from "tslib";
/**
 * Function parameters in this file try to follow a common order for the sake of
 * readability and consistency. The order is as follows:
 *
 * resultData
 * observable
 * client
 * query
 * options
 * watchQueryOptions
 * makeWatchQueryOptions
 * isSSRAllowed
 * disableNetworkFetches
 * partialRefetch
 * renderPromises
 * isSyncSSR
 * callbacks
 */
/** */
import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import { useSyncExternalStore } from "./useSyncExternalStore.js";
import { equal } from "@wry/equality";
import { mergeOptions } from "../../utilities/index.js";
import { getApolloContext } from "../context/index.js";
import { ApolloError } from "../../errors/index.js";
import { NetworkStatus } from "../../core/index.js";
import { DocumentType, verifyDocumentType } from "../parser/index.js";
import { useApolloClient } from "./useApolloClient.js";
import { compact, isNonEmptyArray, maybeDeepFreeze, } from "../../utilities/index.js";
import { wrapHook } from "./internal/index.js";
var hasOwnProperty = Object.prototype.hasOwnProperty;
function noop() { }
export var lastWatchOptions = Symbol();
/**
 * A hook for executing queries in an Apollo application.
 *
 * To run a query within a React component, call `useQuery` and pass it a GraphQL query document.
 *
 * When your component renders, `useQuery` returns an object from Apollo Client that contains `loading`, `error`, and `data` properties you can use to render your UI.
 *
 * > Refer to the [Queries](https://www.apollographql.com/docs/react/data/queries) section for a more in-depth overview of `useQuery`.
 *
 * @example
 * ```jsx
 * import { gql, useQuery } from '@apollo/client';
 *
 * const GET_GREETING = gql`
 *   query GetGreeting($language: String!) {
 *     greeting(language: $language) {
 *       message
 *     }
 *   }
 * `;
 *
 * function Hello() {
 *   const { loading, error, data } = useQuery(GET_GREETING, {
 *     variables: { language: 'english' },
 *   });
 *   if (loading) return <p>Loading ...</p>;
 *   return <h1>Hello {data.greeting.message}!</h1>;
 * }
 * ```
 * @since 3.0.0
 * @param query - A GraphQL query document parsed into an AST by `gql`.
 * @param options - Options to control how the query is executed.
 * @returns Query result object
 */
export function useQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    return wrapHook("useQuery", _useQuery, useApolloClient(options && options.client))(query, options);
}
function _useQuery(query, options) {
    var _a = useQueryInternals(query, options), result = _a.result, obsQueryFields = _a.obsQueryFields;
    return React.useMemo(function () { return (__assign(__assign({}, result), obsQueryFields)); }, [result, obsQueryFields]);
}
function useInternalState(client, query, options, renderPromises, makeWatchQueryOptions) {
    function createInternalState(previous) {
        var _a;
        verifyDocumentType(query, DocumentType.Query);
        var internalState = {
            client: client,
            query: query,
            observable: 
            // See if there is an existing observable that was used to fetch the same
            // data and if so, use it instead since it will contain the proper queryId
            // to fetch the result set. This is used during SSR.
            (renderPromises &&
                renderPromises.getSSRObservable(makeWatchQueryOptions())) ||
                client.watchQuery(getObsQueryOptions(void 0, client, options, makeWatchQueryOptions())),
            resultData: {
                // Reuse previousData from previous InternalState (if any) to provide
                // continuity of previousData even if/when the query or client changes.
                previousData: (_a = previous === null || previous === void 0 ? void 0 : previous.resultData.current) === null || _a === void 0 ? void 0 : _a.data,
            },
        };
        return internalState;
    }
    var _a = React.useState(createInternalState), internalState = _a[0], updateInternalState = _a[1];
    /**
     * Used by `useLazyQuery` when a new query is executed.
     * We keep this logic here since it needs to update things in unsafe
     * ways and here we at least can keep track of that in a single place.
     */
    function onQueryExecuted(watchQueryOptions) {
        var _a;
        var _b;
        // this needs to be set to prevent an immediate `resubscribe` in the
        // next rerender of the `useQuery` internals
        Object.assign(internalState.observable, (_a = {},
            _a[lastWatchOptions] = watchQueryOptions,
            _a));
        var resultData = internalState.resultData;
        updateInternalState(__assign(__assign({}, internalState), { 
            // might be a different query
            query: watchQueryOptions.query, resultData: Object.assign(resultData, {
                // We need to modify the previous `resultData` object as we rely on the
                // object reference in other places
                previousData: ((_b = resultData.current) === null || _b === void 0 ? void 0 : _b.data) || resultData.previousData,
                current: undefined,
            }) }));
    }
    if (client !== internalState.client || query !== internalState.query) {
        // If the client or query have changed, we need to create a new InternalState.
        // This will trigger a re-render with the new state, but it will also continue
        // to run the current render function to completion.
        // Since we sometimes trigger some side-effects in the render function, we
        // re-assign `state` to the new state to ensure that those side-effects are
        // triggered with the new state.
        var newInternalState = createInternalState(internalState);
        updateInternalState(newInternalState);
        return [newInternalState, onQueryExecuted];
    }
    return [internalState, onQueryExecuted];
}
export function useQueryInternals(query, options) {
    var client = useApolloClient(options.client);
    var renderPromises = React.useContext(getApolloContext()).renderPromises;
    var isSyncSSR = !!renderPromises;
    var disableNetworkFetches = client.disableNetworkFetches;
    var ssrAllowed = options.ssr !== false && !options.skip;
    var partialRefetch = options.partialRefetch;
    var makeWatchQueryOptions = createMakeWatchQueryOptions(client, query, options, isSyncSSR);
    var _a = useInternalState(client, query, options, renderPromises, makeWatchQueryOptions), _b = _a[0], observable = _b.observable, resultData = _b.resultData, onQueryExecuted = _a[1];
    var watchQueryOptions = makeWatchQueryOptions(observable);
    useResubscribeIfNecessary(resultData, // might get mutated during render
    observable, // might get mutated during render
    client, options, watchQueryOptions);
    var obsQueryFields = React.useMemo(function () { return bindObservableMethods(observable); }, [observable]);
    useRegisterSSRObservable(observable, renderPromises, ssrAllowed);
    var result = useObservableSubscriptionResult(resultData, observable, client, options, watchQueryOptions, disableNetworkFetches, partialRefetch, isSyncSSR, {
        onCompleted: options.onCompleted || noop,
        onError: options.onError || noop,
    });
    return {
        result: result,
        obsQueryFields: obsQueryFields,
        observable: observable,
        resultData: resultData,
        client: client,
        onQueryExecuted: onQueryExecuted,
    };
}
function useObservableSubscriptionResult(resultData, observable, client, options, watchQueryOptions, disableNetworkFetches, partialRefetch, isSyncSSR, callbacks) {
    var callbackRef = React.useRef(callbacks);
    React.useEffect(function () {
        // Make sure state.onCompleted and state.onError always reflect the latest
        // options.onCompleted and options.onError callbacks provided to useQuery,
        // since those functions are often recreated every time useQuery is called.
        // Like the forceUpdate method, the versions of these methods inherited from
        // InternalState.prototype are empty no-ops, but we can override them on the
        // base state object (without modifying the prototype).
        callbackRef.current = callbacks;
    });
    var resultOverride = ((isSyncSSR || disableNetworkFetches) &&
        options.ssr === false &&
        !options.skip) ?
        // If SSR has been explicitly disabled, and this function has been called
        // on the server side, return the default loading state.
        ssrDisabledResult
        : options.skip || watchQueryOptions.fetchPolicy === "standby" ?
            // When skipping a query (ie. we're not querying for data but still want to
            // render children), make sure the `data` is cleared out and `loading` is
            // set to `false` (since we aren't loading anything).
            //
            // NOTE: We no longer think this is the correct behavior. Skipping should
            // not automatically set `data` to `undefined`, but instead leave the
            // previous data in place. In other words, skipping should not mandate that
            // previously received data is all of a sudden removed. Unfortunately,
            // changing this is breaking, so we'll have to wait until Apollo Client 4.0
            // to address this.
            skipStandbyResult
            : void 0;
    var previousData = resultData.previousData;
    var currentResultOverride = React.useMemo(function () {
        return resultOverride &&
            toQueryResult(resultOverride, previousData, observable, client);
    }, [client, observable, resultOverride, previousData]);
    return useSyncExternalStore(React.useCallback(function (handleStoreChange) {
        // reference `disableNetworkFetches` here to ensure that the rules of hooks
        // keep it as a dependency of this effect, even though it's not used
        disableNetworkFetches;
        if (isSyncSSR) {
            return function () { };
        }
        var onNext = function () {
            var previousResult = resultData.current;
            // We use `getCurrentResult()` instead of the onNext argument because
            // the values differ slightly. Specifically, loading results will have
            // an empty object for data instead of `undefined` for some reason.
            var result = observable.getCurrentResult();
            // Make sure we're not attempting to re-render similar results
            if (previousResult &&
                previousResult.loading === result.loading &&
                previousResult.networkStatus === result.networkStatus &&
                equal(previousResult.data, result.data)) {
                return;
            }
            setResult(result, resultData, observable, client, partialRefetch, handleStoreChange, callbackRef.current);
        };
        var onError = function (error) {
            subscription.current.unsubscribe();
            subscription.current = observable.resubscribeAfterError(onNext, onError);
            if (!hasOwnProperty.call(error, "graphQLErrors")) {
                // The error is not a GraphQL error
                throw error;
            }
            var previousResult = resultData.current;
            if (!previousResult ||
                (previousResult && previousResult.loading) ||
                !equal(error, previousResult.error)) {
                setResult({
                    data: (previousResult && previousResult.data),
                    error: error,
                    loading: false,
                    networkStatus: NetworkStatus.error,
                }, resultData, observable, client, partialRefetch, handleStoreChange, callbackRef.current);
            }
        };
        // TODO evaluate if we keep this in
        // React Compiler cannot handle scoped `let` access, but a mutable object
        // like this is fine.
        // was:
        // let subscription = observable.subscribe(onNext, onError);
        var subscription = { current: observable.subscribe(onNext, onError) };
        // Do the "unsubscribe" with a short delay.
        // This way, an existing subscription can be reused without an additional
        // request if "unsubscribe"  and "resubscribe" to the same ObservableQuery
        // happen in very fast succession.
        return function () {
            setTimeout(function () { return subscription.current.unsubscribe(); });
        };
    }, [
        disableNetworkFetches,
        isSyncSSR,
        observable,
        resultData,
        partialRefetch,
        client,
    ]), function () {
        return currentResultOverride ||
            getCurrentResult(resultData, observable, callbackRef.current, partialRefetch, client);
    }, function () {
        return currentResultOverride ||
            getCurrentResult(resultData, observable, callbackRef.current, partialRefetch, client);
    });
}
function useRegisterSSRObservable(observable, renderPromises, ssrAllowed) {
    if (renderPromises && ssrAllowed) {
        renderPromises.registerSSRObservable(observable);
        if (observable.getCurrentResult().loading) {
            // TODO: This is a legacy API which could probably be cleaned up
            renderPromises.addObservableQueryPromise(observable);
        }
    }
}
// this hook is not compatible with any rules of React, and there's no good way to rewrite it.
// it should stay a separate hook that will not be optimized by the compiler
function useResubscribeIfNecessary(
/** this hook will mutate properties on `resultData` */
resultData, 
/** this hook will mutate properties on `observable` */
observable, client, options, watchQueryOptions) {
    var _a;
    if (observable[lastWatchOptions] &&
        !equal(observable[lastWatchOptions], watchQueryOptions)) {
        // Though it might be tempting to postpone this reobserve call to the
        // useEffect block, we need getCurrentResult to return an appropriate
        // loading:true result synchronously (later within the same call to
        // useQuery). Since we already have this.observable here (not true for
        // the very first call to useQuery), we are not initiating any new
        // subscriptions, though it does feel less than ideal that reobserve
        // (potentially) kicks off a network request (for example, when the
        // variables have changed), which is technically a side-effect.
        observable.reobserve(getObsQueryOptions(observable, client, options, watchQueryOptions));
        // Make sure getCurrentResult returns a fresh ApolloQueryResult<TData>,
        // but save the current data as this.previousData, just like setResult
        // usually does.
        resultData.previousData =
            ((_a = resultData.current) === null || _a === void 0 ? void 0 : _a.data) || resultData.previousData;
        resultData.current = void 0;
    }
    observable[lastWatchOptions] = watchQueryOptions;
}
/*
 * A function to massage options before passing them to ObservableQuery.
 * This is two-step curried because we want to reuse the `make` function,
 * but the `observable` might differ between calls to `make`.
 */
export function createMakeWatchQueryOptions(client, query, _a, isSyncSSR) {
    if (_a === void 0) { _a = {}; }
    var skip = _a.skip, ssr = _a.ssr, onCompleted = _a.onCompleted, onError = _a.onError, defaultOptions = _a.defaultOptions, 
    // The above options are useQuery-specific, so this ...otherOptions spread
    // makes otherOptions almost a WatchQueryOptions object, except for the
    // query property that we add below.
    otherOptions = __rest(_a, ["skip", "ssr", "onCompleted", "onError", "defaultOptions"]);
    return function (observable) {
        // This Object.assign is safe because otherOptions is a fresh ...rest object
        // that did not exist until just now, so modifications are still allowed.
        var watchQueryOptions = Object.assign(otherOptions, { query: query });
        if (isSyncSSR &&
            (watchQueryOptions.fetchPolicy === "network-only" ||
                watchQueryOptions.fetchPolicy === "cache-and-network")) {
            // this behavior was added to react-apollo without explanation in this PR
            // https://github.com/apollographql/react-apollo/pull/1579
            watchQueryOptions.fetchPolicy = "cache-first";
        }
        if (!watchQueryOptions.variables) {
            watchQueryOptions.variables = {};
        }
        if (skip) {
            // When skipping, we set watchQueryOptions.fetchPolicy initially to
            // "standby", but we also need/want to preserve the initial non-standby
            // fetchPolicy that would have been used if not skipping.
            watchQueryOptions.initialFetchPolicy =
                watchQueryOptions.initialFetchPolicy ||
                    watchQueryOptions.fetchPolicy ||
                    getDefaultFetchPolicy(defaultOptions, client.defaultOptions);
            watchQueryOptions.fetchPolicy = "standby";
        }
        else if (!watchQueryOptions.fetchPolicy) {
            watchQueryOptions.fetchPolicy =
                (observable === null || observable === void 0 ? void 0 : observable.options.initialFetchPolicy) ||
                    getDefaultFetchPolicy(defaultOptions, client.defaultOptions);
        }
        return watchQueryOptions;
    };
}
export function getObsQueryOptions(observable, client, queryHookOptions, watchQueryOptions) {
    var toMerge = [];
    var globalDefaults = client.defaultOptions.watchQuery;
    if (globalDefaults)
        toMerge.push(globalDefaults);
    if (queryHookOptions.defaultOptions) {
        toMerge.push(queryHookOptions.defaultOptions);
    }
    // We use compact rather than mergeOptions for this part of the merge,
    // because we want watchQueryOptions.variables (if defined) to replace
    // this.observable.options.variables whole. This replacement allows
    // removing variables by removing them from the variables input to
    // useQuery. If the variables were always merged together (rather than
    // replaced), there would be no way to remove existing variables.
    // However, the variables from options.defaultOptions and globalDefaults
    // (if provided) should be merged, to ensure individual defaulted
    // variables always have values, if not otherwise defined in
    // observable.options or watchQueryOptions.
    toMerge.push(compact(observable && observable.options, watchQueryOptions));
    return toMerge.reduce(mergeOptions);
}
function setResult(nextResult, resultData, observable, client, partialRefetch, forceUpdate, callbacks) {
    var previousResult = resultData.current;
    if (previousResult && previousResult.data) {
        resultData.previousData = previousResult.data;
    }
    if (!nextResult.error && isNonEmptyArray(nextResult.errors)) {
        // Until a set naming convention for networkError and graphQLErrors is
        // decided upon, we map errors (graphQLErrors) to the error options.
        // TODO: Is it possible for both result.error and result.errors to be
        // defined here?
        nextResult.error = new ApolloError({ graphQLErrors: nextResult.errors });
    }
    resultData.current = toQueryResult(unsafeHandlePartialRefetch(nextResult, observable, partialRefetch), resultData.previousData, observable, client);
    // Calling state.setResult always triggers an update, though some call sites
    // perform additional equality checks before committing to an update.
    forceUpdate();
    handleErrorOrCompleted(nextResult, previousResult === null || previousResult === void 0 ? void 0 : previousResult.networkStatus, callbacks);
}
function handleErrorOrCompleted(result, previousNetworkStatus, callbacks) {
    if (!result.loading) {
        var error_1 = toApolloError(result);
        // wait a tick in case we are in the middle of rendering a component
        Promise.resolve()
            .then(function () {
            if (error_1) {
                callbacks.onError(error_1);
            }
            else if (result.data &&
                previousNetworkStatus !== result.networkStatus &&
                result.networkStatus === NetworkStatus.ready) {
                callbacks.onCompleted(result.data);
            }
        })
            .catch(function (error) {
            globalThis.__DEV__ !== false && invariant.warn(error);
        });
    }
}
function getCurrentResult(resultData, observable, callbacks, partialRefetch, client) {
    // Using this.result as a cache ensures getCurrentResult continues returning
    // the same (===) result object, unless state.setResult has been called, or
    // we're doing server rendering and therefore override the result below.
    if (!resultData.current) {
        // WARNING: SIDE-EFFECTS IN THE RENDER FUNCTION
        // this could call unsafeHandlePartialRefetch
        setResult(observable.getCurrentResult(), resultData, observable, client, partialRefetch, function () { }, callbacks);
    }
    return resultData.current;
}
export function getDefaultFetchPolicy(queryHookDefaultOptions, clientDefaultOptions) {
    var _a;
    return ((queryHookDefaultOptions === null || queryHookDefaultOptions === void 0 ? void 0 : queryHookDefaultOptions.fetchPolicy) ||
        ((_a = clientDefaultOptions === null || clientDefaultOptions === void 0 ? void 0 : clientDefaultOptions.watchQuery) === null || _a === void 0 ? void 0 : _a.fetchPolicy) ||
        "cache-first");
}
export function toApolloError(result) {
    return isNonEmptyArray(result.errors) ?
        new ApolloError({ graphQLErrors: result.errors })
        : result.error;
}
export function toQueryResult(result, previousData, observable, client) {
    var data = result.data, partial = result.partial, resultWithoutPartial = __rest(result, ["data", "partial"]);
    var queryResult = __assign(__assign({ data: data }, resultWithoutPartial), { client: client, observable: observable, variables: observable.variables, called: result !== ssrDisabledResult && result !== skipStandbyResult, previousData: previousData });
    return queryResult;
}
function unsafeHandlePartialRefetch(result, observable, partialRefetch) {
    // TODO: This code should be removed when the partialRefetch option is
    // removed. I was unable to get this hook to behave reasonably in certain
    // edge cases when this block was put in an effect.
    if (result.partial &&
        partialRefetch &&
        !result.loading &&
        (!result.data || Object.keys(result.data).length === 0) &&
        observable.options.fetchPolicy !== "cache-only") {
        observable.refetch();
        return __assign(__assign({}, result), { loading: true, networkStatus: NetworkStatus.refetch });
    }
    return result;
}
var ssrDisabledResult = maybeDeepFreeze({
    loading: true,
    data: void 0,
    error: void 0,
    networkStatus: NetworkStatus.loading,
});
var skipStandbyResult = maybeDeepFreeze({
    loading: false,
    data: void 0,
    error: void 0,
    networkStatus: NetworkStatus.ready,
});
function bindObservableMethods(observable) {
    return {
        refetch: observable.refetch.bind(observable),
        reobserve: observable.reobserve.bind(observable),
        fetchMore: observable.fetchMore.bind(observable),
        updateQuery: observable.updateQuery.bind(observable),
        startPolling: observable.startPolling.bind(observable),
        stopPolling: observable.stopPolling.bind(observable),
        subscribeToMore: observable.subscribeToMore.bind(observable),
    };
}
//# sourceMappingURL=useQuery.js.map