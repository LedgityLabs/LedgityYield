'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var globals = require('../../utilities/globals');
var React = require('rehackt');
var context = require('../context');
var tslib = require('tslib');
var utilities = require('../../utilities');
var equal = require('@wry/equality');
var errors = require('../../errors');
var core = require('../../core');
var parser = require('../parser');
var internal = require('../internal');
var cache = require('../../cache');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        for (var k in e) {
            n[k] = e[k];
        }
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var equal__default = /*#__PURE__*/_interopDefaultLegacy(equal);

function useApolloClient(override) {
    var context$1 = React__namespace.useContext(context.getApolloContext());
    var client = override || context$1.client;
    globals.invariant(!!client, 50);
    return client;
}

var didWarnUncachedGetSnapshot = false;
var uSESKey = "useSyncExternalStore";
var realHook$1 = React__namespace[uSESKey];
var useSyncExternalStore = realHook$1 ||
    (function (subscribe, getSnapshot, getServerSnapshot) {
        var value = getSnapshot();
        if (
        globalThis.__DEV__ !== false &&
            !didWarnUncachedGetSnapshot &&
            value !== getSnapshot()) {
            didWarnUncachedGetSnapshot = true;
            globalThis.__DEV__ !== false && globals.invariant.error(60);
        }
        var _a = React__namespace.useState({
            inst: { value: value, getSnapshot: getSnapshot },
        }), inst = _a[0].inst, forceUpdate = _a[1];
        if (utilities.canUseLayoutEffect) {
            React__namespace.useLayoutEffect(function () {
                Object.assign(inst, { value: value, getSnapshot: getSnapshot });
                if (checkIfSnapshotChanged(inst)) {
                    forceUpdate({ inst: inst });
                }
            }, [subscribe, value, getSnapshot]);
        }
        else {
            Object.assign(inst, { value: value, getSnapshot: getSnapshot });
        }
        React__namespace.useEffect(function () {
            if (checkIfSnapshotChanged(inst)) {
                forceUpdate({ inst: inst });
            }
            return subscribe(function handleStoreChange() {
                if (checkIfSnapshotChanged(inst)) {
                    forceUpdate({ inst: inst });
                }
            });
        }, [subscribe]);
        return value;
    });
function checkIfSnapshotChanged(_a) {
    var value = _a.value, getSnapshot = _a.getSnapshot;
    try {
        return value !== getSnapshot();
    }
    catch (_b) {
        return true;
    }
}

function useDeepMemo(memoFn, deps) {
    var ref = React__namespace.useRef();
    if (!ref.current || !equal.equal(ref.current.deps, deps)) {
        ref.current = { value: memoFn(), deps: deps };
    }
    return ref.current.value;
}

var useIsomorphicLayoutEffect = utilities.canUseDOM ? React__namespace.useLayoutEffect : React__namespace.useEffect;

var Ctx;
function noop$1() { }
function useRenderGuard() {
    if (!Ctx) {
        Ctx = React__namespace.createContext(null);
    }
    return React__namespace.useCallback(
 function () {
        var orig = console.error;
        try {
            console.error = noop$1;
            React__namespace["useContext" ](Ctx);
            return true;
        }
        catch (e) {
            return false;
        }
        finally {
            console.error = orig;
        }
    }, []);
}

var useKey = "use";
var realHook = React__namespace[useKey];
var __use = realHook ||
    function __use(promise) {
        var statefulPromise = utilities.wrapPromiseWithState(promise);
        switch (statefulPromise.status) {
            case "pending":
                throw statefulPromise;
            case "rejected":
                throw statefulPromise.reason;
            case "fulfilled":
                return statefulPromise.value;
        }
    };

var wrapperSymbol = Symbol.for("apollo.hook.wrappers");
function wrapHook(hookName, useHook, clientOrObsQuery) {
    var queryManager = clientOrObsQuery["queryManager"];
    var wrappers = queryManager && queryManager[wrapperSymbol];
    var wrapper = wrappers && wrappers[hookName];
    return wrapper ? wrapper(useHook) : useHook;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function noop() { }
var lastWatchOptions = Symbol();
function useQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    return wrapHook("useQuery", _useQuery, useApolloClient(options && options.client))(query, options);
}
function _useQuery(query, options) {
    var _a = useQueryInternals(query, options), result = _a.result, obsQueryFields = _a.obsQueryFields;
    return React__namespace.useMemo(function () { return (tslib.__assign(tslib.__assign({}, result), obsQueryFields)); }, [result, obsQueryFields]);
}
function useInternalState(client, query, options, renderPromises, makeWatchQueryOptions) {
    function createInternalState(previous) {
        var _a;
        parser.verifyDocumentType(query, parser.DocumentType.Query);
        var internalState = {
            client: client,
            query: query,
            observable:
            (renderPromises &&
                renderPromises.getSSRObservable(makeWatchQueryOptions())) ||
                client.watchQuery(getObsQueryOptions(void 0, client, options, makeWatchQueryOptions())),
            resultData: {
                previousData: (_a = previous === null || previous === void 0 ? void 0 : previous.resultData.current) === null || _a === void 0 ? void 0 : _a.data,
            },
        };
        return internalState;
    }
    var _a = React__namespace.useState(createInternalState), internalState = _a[0], updateInternalState = _a[1];
    function onQueryExecuted(watchQueryOptions) {
        var _a;
        var _b;
        Object.assign(internalState.observable, (_a = {},
            _a[lastWatchOptions] = watchQueryOptions,
            _a));
        var resultData = internalState.resultData;
        updateInternalState(tslib.__assign(tslib.__assign({}, internalState), {
            query: watchQueryOptions.query, resultData: Object.assign(resultData, {
                previousData: ((_b = resultData.current) === null || _b === void 0 ? void 0 : _b.data) || resultData.previousData,
                current: undefined,
            }) }));
    }
    if (client !== internalState.client || query !== internalState.query) {
        var newInternalState = createInternalState(internalState);
        updateInternalState(newInternalState);
        return [newInternalState, onQueryExecuted];
    }
    return [internalState, onQueryExecuted];
}
function useQueryInternals(query, options) {
    var client = useApolloClient(options.client);
    var renderPromises = React__namespace.useContext(context.getApolloContext()).renderPromises;
    var isSyncSSR = !!renderPromises;
    var disableNetworkFetches = client.disableNetworkFetches;
    var ssrAllowed = options.ssr !== false && !options.skip;
    var partialRefetch = options.partialRefetch;
    var makeWatchQueryOptions = createMakeWatchQueryOptions(client, query, options, isSyncSSR);
    var _a = useInternalState(client, query, options, renderPromises, makeWatchQueryOptions), _b = _a[0], observable = _b.observable, resultData = _b.resultData, onQueryExecuted = _a[1];
    var watchQueryOptions = makeWatchQueryOptions(observable);
    useResubscribeIfNecessary(resultData,
    observable,
    client, options, watchQueryOptions);
    var obsQueryFields = React__namespace.useMemo(function () { return bindObservableMethods(observable); }, [observable]);
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
    var callbackRef = React__namespace.useRef(callbacks);
    React__namespace.useEffect(function () {
        callbackRef.current = callbacks;
    });
    var resultOverride = ((isSyncSSR || disableNetworkFetches) &&
        options.ssr === false &&
        !options.skip) ?
        ssrDisabledResult
        : options.skip || watchQueryOptions.fetchPolicy === "standby" ?
            skipStandbyResult
            : void 0;
    var previousData = resultData.previousData;
    var currentResultOverride = React__namespace.useMemo(function () {
        return resultOverride &&
            toQueryResult(resultOverride, previousData, observable, client);
    }, [client, observable, resultOverride, previousData]);
    return useSyncExternalStore(React__namespace.useCallback(function (handleStoreChange) {
        if (isSyncSSR) {
            return function () { };
        }
        var onNext = function () {
            var previousResult = resultData.current;
            var result = observable.getCurrentResult();
            if (previousResult &&
                previousResult.loading === result.loading &&
                previousResult.networkStatus === result.networkStatus &&
                equal.equal(previousResult.data, result.data)) {
                return;
            }
            setResult(result, resultData, observable, client, partialRefetch, handleStoreChange, callbackRef.current);
        };
        var onError = function (error) {
            subscription.current.unsubscribe();
            subscription.current = observable.resubscribeAfterError(onNext, onError);
            if (!hasOwnProperty.call(error, "graphQLErrors")) {
                throw error;
            }
            var previousResult = resultData.current;
            if (!previousResult ||
                (previousResult && previousResult.loading) ||
                !equal.equal(error, previousResult.error)) {
                setResult({
                    data: (previousResult && previousResult.data),
                    error: error,
                    loading: false,
                    networkStatus: core.NetworkStatus.error,
                }, resultData, observable, client, partialRefetch, handleStoreChange, callbackRef.current);
            }
        };
        var subscription = { current: observable.subscribe(onNext, onError) };
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
            renderPromises.addObservableQueryPromise(observable);
        }
    }
}
function useResubscribeIfNecessary(
resultData,
observable, client, options, watchQueryOptions) {
    var _a;
    if (observable[lastWatchOptions] &&
        !equal.equal(observable[lastWatchOptions], watchQueryOptions)) {
        observable.reobserve(getObsQueryOptions(observable, client, options, watchQueryOptions));
        resultData.previousData =
            ((_a = resultData.current) === null || _a === void 0 ? void 0 : _a.data) || resultData.previousData;
        resultData.current = void 0;
    }
    observable[lastWatchOptions] = watchQueryOptions;
}
function createMakeWatchQueryOptions(client, query, _a, isSyncSSR) {
    if (_a === void 0) { _a = {}; }
    var skip = _a.skip; _a.ssr; _a.onCompleted; _a.onError; var defaultOptions = _a.defaultOptions,
    otherOptions = tslib.__rest(_a, ["skip", "ssr", "onCompleted", "onError", "defaultOptions"]);
    return function (observable) {
        var watchQueryOptions = Object.assign(otherOptions, { query: query });
        if (isSyncSSR &&
            (watchQueryOptions.fetchPolicy === "network-only" ||
                watchQueryOptions.fetchPolicy === "cache-and-network")) {
            watchQueryOptions.fetchPolicy = "cache-first";
        }
        if (!watchQueryOptions.variables) {
            watchQueryOptions.variables = {};
        }
        if (skip) {
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
function getObsQueryOptions(observable, client, queryHookOptions, watchQueryOptions) {
    var toMerge = [];
    var globalDefaults = client.defaultOptions.watchQuery;
    if (globalDefaults)
        toMerge.push(globalDefaults);
    if (queryHookOptions.defaultOptions) {
        toMerge.push(queryHookOptions.defaultOptions);
    }
    toMerge.push(utilities.compact(observable && observable.options, watchQueryOptions));
    return toMerge.reduce(utilities.mergeOptions);
}
function setResult(nextResult, resultData, observable, client, partialRefetch, forceUpdate, callbacks) {
    var previousResult = resultData.current;
    if (previousResult && previousResult.data) {
        resultData.previousData = previousResult.data;
    }
    if (!nextResult.error && utilities.isNonEmptyArray(nextResult.errors)) {
        nextResult.error = new errors.ApolloError({ graphQLErrors: nextResult.errors });
    }
    resultData.current = toQueryResult(unsafeHandlePartialRefetch(nextResult, observable, partialRefetch), resultData.previousData, observable, client);
    forceUpdate();
    handleErrorOrCompleted(nextResult, previousResult === null || previousResult === void 0 ? void 0 : previousResult.networkStatus, callbacks);
}
function handleErrorOrCompleted(result, previousNetworkStatus, callbacks) {
    if (!result.loading) {
        var error_1 = toApolloError$1(result);
        Promise.resolve()
            .then(function () {
            if (error_1) {
                callbacks.onError(error_1);
            }
            else if (result.data &&
                previousNetworkStatus !== result.networkStatus &&
                result.networkStatus === core.NetworkStatus.ready) {
                callbacks.onCompleted(result.data);
            }
        })
            .catch(function (error) {
            globalThis.__DEV__ !== false && globals.invariant.warn(error);
        });
    }
}
function getCurrentResult(resultData, observable, callbacks, partialRefetch, client) {
    if (!resultData.current) {
        setResult(observable.getCurrentResult(), resultData, observable, client, partialRefetch, function () { }, callbacks);
    }
    return resultData.current;
}
function getDefaultFetchPolicy(queryHookDefaultOptions, clientDefaultOptions) {
    var _a;
    return ((queryHookDefaultOptions === null || queryHookDefaultOptions === void 0 ? void 0 : queryHookDefaultOptions.fetchPolicy) ||
        ((_a = clientDefaultOptions === null || clientDefaultOptions === void 0 ? void 0 : clientDefaultOptions.watchQuery) === null || _a === void 0 ? void 0 : _a.fetchPolicy) ||
        "cache-first");
}
function toApolloError$1(result) {
    return utilities.isNonEmptyArray(result.errors) ?
        new errors.ApolloError({ graphQLErrors: result.errors })
        : result.error;
}
function toQueryResult(result, previousData, observable, client) {
    var data = result.data; result.partial; var resultWithoutPartial = tslib.__rest(result, ["data", "partial"]);
    var queryResult = tslib.__assign(tslib.__assign({ data: data }, resultWithoutPartial), { client: client, observable: observable, variables: observable.variables, called: result !== ssrDisabledResult && result !== skipStandbyResult, previousData: previousData });
    return queryResult;
}
function unsafeHandlePartialRefetch(result, observable, partialRefetch) {
    if (result.partial &&
        partialRefetch &&
        !result.loading &&
        (!result.data || Object.keys(result.data).length === 0) &&
        observable.options.fetchPolicy !== "cache-only") {
        observable.refetch();
        return tslib.__assign(tslib.__assign({}, result), { loading: true, networkStatus: core.NetworkStatus.refetch });
    }
    return result;
}
var ssrDisabledResult = utilities.maybeDeepFreeze({
    loading: true,
    data: void 0,
    error: void 0,
    networkStatus: core.NetworkStatus.loading,
});
var skipStandbyResult = utilities.maybeDeepFreeze({
    loading: false,
    data: void 0,
    error: void 0,
    networkStatus: core.NetworkStatus.ready,
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

var EAGER_METHODS = [
    "refetch",
    "reobserve",
    "fetchMore",
    "updateQuery",
    "startPolling",
    "stopPolling",
    "subscribeToMore",
];
function useLazyQuery(query, options) {
    var _a;
    var execOptionsRef = React__namespace.useRef();
    var optionsRef = React__namespace.useRef();
    var queryRef = React__namespace.useRef();
    var merged = utilities.mergeOptions(options, execOptionsRef.current || {});
    var document = (_a = merged === null || merged === void 0 ? void 0 : merged.query) !== null && _a !== void 0 ? _a : query;
    optionsRef.current = options;
    queryRef.current = document;
    var queryHookOptions = tslib.__assign(tslib.__assign({}, merged), { skip: !execOptionsRef.current });
    var _b = useQueryInternals(document, queryHookOptions), obsQueryFields = _b.obsQueryFields, useQueryResult = _b.result, client = _b.client, resultData = _b.resultData, observable = _b.observable, onQueryExecuted = _b.onQueryExecuted;
    var initialFetchPolicy = observable.options.initialFetchPolicy ||
        getDefaultFetchPolicy(queryHookOptions.defaultOptions, client.defaultOptions);
    var forceUpdateState = React__namespace.useReducer(function (tick) { return tick + 1; }, 0)[1];
    var eagerMethods = React__namespace.useMemo(function () {
        var eagerMethods = {};
        var _loop_1 = function (key) {
            var method = obsQueryFields[key];
            eagerMethods[key] = function () {
                if (!execOptionsRef.current) {
                    execOptionsRef.current = Object.create(null);
                    forceUpdateState();
                }
                return method.apply(this, arguments);
            };
        };
        for (var _i = 0, EAGER_METHODS_1 = EAGER_METHODS; _i < EAGER_METHODS_1.length; _i++) {
            var key = EAGER_METHODS_1[_i];
            _loop_1(key);
        }
        return eagerMethods;
    }, [forceUpdateState, obsQueryFields]);
    var called = !!execOptionsRef.current;
    var result = React__namespace.useMemo(function () { return (tslib.__assign(tslib.__assign(tslib.__assign({}, useQueryResult), eagerMethods), { called: called })); }, [useQueryResult, eagerMethods, called]);
    var execute = React__namespace.useCallback(function (executeOptions) {
        execOptionsRef.current =
            executeOptions ? tslib.__assign(tslib.__assign({}, executeOptions), { fetchPolicy: executeOptions.fetchPolicy || initialFetchPolicy }) : {
                fetchPolicy: initialFetchPolicy,
            };
        var options = utilities.mergeOptions(optionsRef.current, tslib.__assign({ query: queryRef.current }, execOptionsRef.current));
        var promise = executeQuery(resultData, observable, client, document, tslib.__assign(tslib.__assign({}, options), { skip: false }), onQueryExecuted).then(function (queryResult) { return Object.assign(queryResult, eagerMethods); });
        promise.catch(function () { });
        return promise;
    }, [
        client,
        document,
        eagerMethods,
        initialFetchPolicy,
        observable,
        resultData,
        onQueryExecuted,
    ]);
    var executeRef = React__namespace.useRef(execute);
    useIsomorphicLayoutEffect(function () {
        executeRef.current = execute;
    });
    var stableExecute = React__namespace.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return executeRef.current.apply(executeRef, args);
    }, []);
    return [stableExecute, result];
}
function executeQuery(resultData, observable, client, currentQuery, options, onQueryExecuted) {
    var query = options.query || currentQuery;
    var watchQueryOptions = createMakeWatchQueryOptions(client, query, options, false)(observable);
    var concast = observable.reobserveAsConcast(getObsQueryOptions(observable, client, options, watchQueryOptions));
    onQueryExecuted(watchQueryOptions);
    return new Promise(function (resolve) {
        var result;
        concast.subscribe({
            next: function (value) {
                result = value;
            },
            error: function () {
                resolve(toQueryResult(observable.getCurrentResult(), resultData.previousData, observable, client));
            },
            complete: function () {
                resolve(toQueryResult(result, resultData.previousData, observable, client));
            },
        });
    });
}

function useMutation(mutation, options) {
    var client = useApolloClient(options === null || options === void 0 ? void 0 : options.client);
    parser.verifyDocumentType(mutation, parser.DocumentType.Mutation);
    var _a = React__namespace.useState({
        called: false,
        loading: false,
        client: client,
    }), result = _a[0], setResult = _a[1];
    var ref = React__namespace.useRef({
        result: result,
        mutationId: 0,
        isMounted: true,
        client: client,
        mutation: mutation,
        options: options,
    });
    useIsomorphicLayoutEffect(function () {
        Object.assign(ref.current, { client: client, options: options, mutation: mutation });
    });
    var execute = React__namespace.useCallback(function (executeOptions) {
        if (executeOptions === void 0) { executeOptions = {}; }
        var _a = ref.current, options = _a.options, mutation = _a.mutation;
        var baseOptions = tslib.__assign(tslib.__assign({}, options), { mutation: mutation });
        var client = executeOptions.client || ref.current.client;
        if (!ref.current.result.loading &&
            !baseOptions.ignoreResults &&
            ref.current.isMounted) {
            setResult((ref.current.result = {
                loading: true,
                error: void 0,
                data: void 0,
                called: true,
                client: client,
            }));
        }
        var mutationId = ++ref.current.mutationId;
        var clientOptions = utilities.mergeOptions(baseOptions, executeOptions);
        return client
            .mutate(clientOptions)
            .then(function (response) {
            var _a, _b;
            var data = response.data, errors$1 = response.errors;
            var error = errors$1 && errors$1.length > 0 ?
                new errors.ApolloError({ graphQLErrors: errors$1 })
                : void 0;
            var onError = executeOptions.onError || ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onError);
            if (error && onError) {
                onError(error, clientOptions);
            }
            if (mutationId === ref.current.mutationId &&
                !clientOptions.ignoreResults) {
                var result_1 = {
                    called: true,
                    loading: false,
                    data: data,
                    error: error,
                    client: client,
                };
                if (ref.current.isMounted && !equal.equal(ref.current.result, result_1)) {
                    setResult((ref.current.result = result_1));
                }
            }
            var onCompleted = executeOptions.onCompleted || ((_b = ref.current.options) === null || _b === void 0 ? void 0 : _b.onCompleted);
            if (!error) {
                onCompleted === null || onCompleted === void 0 ? void 0 : onCompleted(response.data, clientOptions);
            }
            return response;
        })
            .catch(function (error) {
            var _a;
            if (mutationId === ref.current.mutationId && ref.current.isMounted) {
                var result_2 = {
                    loading: false,
                    error: error,
                    data: void 0,
                    called: true,
                    client: client,
                };
                if (!equal.equal(ref.current.result, result_2)) {
                    setResult((ref.current.result = result_2));
                }
            }
            var onError = executeOptions.onError || ((_a = ref.current.options) === null || _a === void 0 ? void 0 : _a.onError);
            if (onError) {
                onError(error, clientOptions);
                return { data: void 0, errors: error };
            }
            throw error;
        });
    }, []);
    var reset = React__namespace.useCallback(function () {
        if (ref.current.isMounted) {
            var result_3 = {
                called: false,
                loading: false,
                client: ref.current.client,
            };
            Object.assign(ref.current, { mutationId: 0, result: result_3 });
            setResult(result_3);
        }
    }, []);
    React__namespace.useEffect(function () {
        var current = ref.current;
        current.isMounted = true;
        return function () {
            current.isMounted = false;
        };
    }, []);
    return [execute, tslib.__assign({ reset: reset }, result)];
}

function useSubscription(subscription, options) {
    if (options === void 0) { options = Object.create(null); }
    var hasIssuedDeprecationWarningRef = React__namespace.useRef(false);
    var client = useApolloClient(options.client);
    parser.verifyDocumentType(subscription, parser.DocumentType.Subscription);
    if (!hasIssuedDeprecationWarningRef.current) {
        hasIssuedDeprecationWarningRef.current = true;
        if (options.onSubscriptionData) {
            globalThis.__DEV__ !== false && globals.invariant.warn(options.onData ? 53 : 54);
        }
        if (options.onSubscriptionComplete) {
            globalThis.__DEV__ !== false && globals.invariant.warn(options.onComplete ? 55 : 56);
        }
    }
    var skip = options.skip, fetchPolicy = options.fetchPolicy, errorPolicy = options.errorPolicy, shouldResubscribe = options.shouldResubscribe, context = options.context, extensions = options.extensions, ignoreResults = options.ignoreResults;
    var variables = useDeepMemo(function () { return options.variables; }, [options.variables]);
    var recreate = function () {
        return createSubscription(client, subscription, variables, fetchPolicy, errorPolicy, context, extensions);
    };
    var _a = React__namespace.useState(options.skip ? null : recreate), observable = _a[0], setObservable = _a[1];
    var recreateRef = React__namespace.useRef(recreate);
    useIsomorphicLayoutEffect(function () {
        recreateRef.current = recreate;
    });
    if (skip) {
        if (observable) {
            setObservable((observable = null));
        }
    }
    else if (!observable ||
        ((client !== observable.__.client ||
            subscription !== observable.__.query ||
            fetchPolicy !== observable.__.fetchPolicy ||
            errorPolicy !== observable.__.errorPolicy ||
            !equal.equal(variables, observable.__.variables)) &&
            (typeof shouldResubscribe === "function" ?
                !!shouldResubscribe(options)
                : shouldResubscribe) !== false)) {
        setObservable((observable = recreate()));
    }
    var optionsRef = React__namespace.useRef(options);
    React__namespace.useEffect(function () {
        optionsRef.current = options;
    });
    var fallbackLoading = !skip && !ignoreResults;
    var fallbackResult = React__namespace.useMemo(function () { return ({
        loading: fallbackLoading,
        error: void 0,
        data: void 0,
        variables: variables,
    }); }, [fallbackLoading, variables]);
    var ignoreResultsRef = React__namespace.useRef(ignoreResults);
    useIsomorphicLayoutEffect(function () {
        ignoreResultsRef.current = ignoreResults;
    });
    var ret = useSyncExternalStore(React__namespace.useCallback(function (update) {
        if (!observable) {
            return function () { };
        }
        var subscriptionStopped = false;
        var variables = observable.__.variables;
        var client = observable.__.client;
        var subscription = observable.subscribe({
            next: function (fetchResult) {
                var _a, _b;
                if (subscriptionStopped) {
                    return;
                }
                var result = {
                    loading: false,
                    data: fetchResult.data,
                    error: toApolloError$1(fetchResult),
                    variables: variables,
                };
                observable.__.setResult(result);
                if (!ignoreResultsRef.current)
                    update();
                if (result.error) {
                    (_b = (_a = optionsRef.current).onError) === null || _b === void 0 ? void 0 : _b.call(_a, result.error);
                }
                else if (optionsRef.current.onData) {
                    optionsRef.current.onData({
                        client: client,
                        data: result,
                    });
                }
                else if (optionsRef.current.onSubscriptionData) {
                    optionsRef.current.onSubscriptionData({
                        client: client,
                        subscriptionData: result,
                    });
                }
            },
            error: function (error) {
                var _a, _b;
                error =
                    error instanceof core.ApolloError ? error : (new core.ApolloError({ protocolErrors: [error] }));
                if (!subscriptionStopped) {
                    observable.__.setResult({
                        loading: false,
                        data: void 0,
                        error: error,
                        variables: variables,
                    });
                    if (!ignoreResultsRef.current)
                        update();
                    (_b = (_a = optionsRef.current).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error);
                }
            },
            complete: function () {
                if (!subscriptionStopped) {
                    if (optionsRef.current.onComplete) {
                        optionsRef.current.onComplete();
                    }
                    else if (optionsRef.current.onSubscriptionComplete) {
                        optionsRef.current.onSubscriptionComplete();
                    }
                }
            },
        });
        return function () {
            subscriptionStopped = true;
            setTimeout(function () {
                subscription.unsubscribe();
            });
        };
    }, [observable]), function () {
        return observable && !skip && !ignoreResults ?
            observable.__.result
            : fallbackResult;
    }, function () { return fallbackResult; });
    var restart = React__namespace.useCallback(function () {
        globals.invariant(!optionsRef.current.skip, 57);
        setObservable(recreateRef.current());
    }, [optionsRef, recreateRef]);
    return React__namespace.useMemo(function () { return (tslib.__assign(tslib.__assign({}, ret), { restart: restart })); }, [ret, restart]);
}
function createSubscription(client, query, variables, fetchPolicy, errorPolicy, context, extensions) {
    var options = {
        query: query,
        variables: variables,
        fetchPolicy: fetchPolicy,
        errorPolicy: errorPolicy,
        context: context,
        extensions: extensions,
    };
    var __ = tslib.__assign(tslib.__assign({}, options), { client: client, result: {
            loading: true,
            data: void 0,
            error: void 0,
            variables: variables,
        }, setResult: function (result) {
            __.result = result;
        } });
    var observable = null;
    return Object.assign(new core.Observable(function (observer) {
        if (!observable) {
            observable = client.subscribe(options);
        }
        var sub = observable.subscribe(observer);
        return function () { return sub.unsubscribe(); };
    }), {
        __: __,
    });
}

function useReactiveVar(rv) {
    return useSyncExternalStore(React__namespace.useCallback(function (update) {
        return rv.onNextChange(function onNext() {
            update();
            rv.onNextChange(onNext);
        });
    }, [rv]), rv, rv);
}

function useFragment(options) {
    return wrapHook("useFragment", _useFragment, useApolloClient(options.client))(options);
}
function _useFragment(options) {
    var cache = useApolloClient(options.client).cache;
    var from = options.from, rest = tslib.__rest(options, ["from"]);
    var id = React__namespace.useMemo(function () { return (typeof from === "string" ? from : cache.identify(from)); }, [cache, from]);
    var stableOptions = useDeepMemo(function () { return (tslib.__assign(tslib.__assign({}, rest), { from: id })); }, [rest, id]);
    var diff = React__namespace.useMemo(function () {
        var fragment = stableOptions.fragment, fragmentName = stableOptions.fragmentName, from = stableOptions.from, _a = stableOptions.optimistic, optimistic = _a === void 0 ? true : _a;
        return {
            result: diffToResult(cache.diff(tslib.__assign(tslib.__assign({}, stableOptions), { returnPartialData: true, id: from, query: cache["getFragmentDoc"](fragment, fragmentName), optimistic: optimistic }))),
        };
    }, [stableOptions, cache]);
    var getSnapshot = React__namespace.useCallback(function () { return diff.result; }, [diff]);
    return useSyncExternalStore(React__namespace.useCallback(function (forceUpdate) {
        var lastTimeout = 0;
        var subscription = cache.watchFragment(stableOptions).subscribe({
            next: function (result) {
                if (equal__default(result, diff.result))
                    return;
                diff.result = result;
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
        result.missing = utilities.mergeDeepArray(diff.missing.map(function (error) { return error.missing; }));
    }
    return result;
}

var skipToken = Symbol.for("apollo.skipToken");

function useSuspenseQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    return wrapHook("useSuspenseQuery", _useSuspenseQuery, useApolloClient(typeof options === "object" ? options.client : undefined))(query, options);
}
function _useSuspenseQuery(query, options) {
    var client = useApolloClient(options.client);
    var suspenseCache = internal.getSuspenseCache(client);
    var watchQueryOptions = useWatchQueryOptions({
        client: client,
        query: query,
        options: options,
    });
    var fetchPolicy = watchQueryOptions.fetchPolicy, variables = watchQueryOptions.variables;
    var _a = options.queryKey, queryKey = _a === void 0 ? [] : _a;
    var cacheKey = tslib.__spreadArray([
        query,
        cache.canonicalStringify(variables)
    ], [].concat(queryKey), true);
    var queryRef = suspenseCache.getQueryRef(cacheKey, function () {
        return client.watchQuery(watchQueryOptions);
    });
    var _b = React__namespace.useState([queryRef.key, queryRef.promise]), current = _b[0], setPromise = _b[1];
    if (current[0] !== queryRef.key) {
        current[0] = queryRef.key;
        current[1] = queryRef.promise;
    }
    var promise = current[1];
    if (queryRef.didChangeOptions(watchQueryOptions)) {
        current[1] = promise = queryRef.applyOptions(watchQueryOptions);
    }
    React__namespace.useEffect(function () {
        var dispose = queryRef.retain();
        var removeListener = queryRef.listen(function (promise) {
            setPromise([queryRef.key, promise]);
        });
        return function () {
            removeListener();
            dispose();
        };
    }, [queryRef]);
    var skipResult = React__namespace.useMemo(function () {
        var error = toApolloError(queryRef.result);
        return {
            loading: false,
            data: queryRef.result.data,
            networkStatus: error ? core.NetworkStatus.error : core.NetworkStatus.ready,
            error: error,
        };
    }, [queryRef.result]);
    var result = fetchPolicy === "standby" ? skipResult : __use(promise);
    var fetchMore = React__namespace.useCallback(function (options) {
        var promise = queryRef.fetchMore(options);
        setPromise([queryRef.key, queryRef.promise]);
        return promise;
    }, [queryRef]);
    var refetch = React__namespace.useCallback(function (variables) {
        var promise = queryRef.refetch(variables);
        setPromise([queryRef.key, queryRef.promise]);
        return promise;
    }, [queryRef]);
    var subscribeToMore = queryRef.observable.subscribeToMore;
    return React__namespace.useMemo(function () {
        return {
            client: client,
            data: result.data,
            error: toApolloError(result),
            networkStatus: result.networkStatus,
            fetchMore: fetchMore,
            refetch: refetch,
            subscribeToMore: subscribeToMore,
        };
    }, [client, fetchMore, refetch, result, subscribeToMore]);
}
function validateOptions(options) {
    var query = options.query, fetchPolicy = options.fetchPolicy, returnPartialData = options.returnPartialData;
    parser.verifyDocumentType(query, parser.DocumentType.Query);
    validateFetchPolicy(fetchPolicy);
    validatePartialDataReturn(fetchPolicy, returnPartialData);
}
function validateFetchPolicy(fetchPolicy) {
    if (fetchPolicy === void 0) { fetchPolicy = "cache-first"; }
    var supportedFetchPolicies = [
        "cache-first",
        "network-only",
        "no-cache",
        "cache-and-network",
    ];
    globals.invariant(supportedFetchPolicies.includes(fetchPolicy), 58, fetchPolicy);
}
function validatePartialDataReturn(fetchPolicy, returnPartialData) {
    if (fetchPolicy === "no-cache" && returnPartialData) {
        globalThis.__DEV__ !== false && globals.invariant.warn(59);
    }
}
function toApolloError(result) {
    return utilities.isNonEmptyArray(result.errors) ?
        new core.ApolloError({ graphQLErrors: result.errors })
        : result.error;
}
function useWatchQueryOptions(_a) {
    var client = _a.client, query = _a.query, options = _a.options;
    return useDeepMemo(function () {
        var _a;
        if (options === skipToken) {
            return { query: query, fetchPolicy: "standby" };
        }
        var fetchPolicy = options.fetchPolicy ||
            ((_a = client.defaultOptions.watchQuery) === null || _a === void 0 ? void 0 : _a.fetchPolicy) ||
            "cache-first";
        var watchQueryOptions = tslib.__assign(tslib.__assign({}, options), { fetchPolicy: fetchPolicy, query: query, notifyOnNetworkStatusChange: false, nextFetchPolicy: void 0 });
        if (globalThis.__DEV__ !== false) {
            validateOptions(watchQueryOptions);
        }
        if (options.skip) {
            watchQueryOptions.fetchPolicy = "standby";
        }
        return watchQueryOptions;
    }, [client, options, query]);
}

function useBackgroundQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    return wrapHook("useBackgroundQuery", _useBackgroundQuery, useApolloClient(typeof options === "object" ? options.client : undefined))(query, options);
}
function _useBackgroundQuery(query, options) {
    var client = useApolloClient(options.client);
    var suspenseCache = internal.getSuspenseCache(client);
    var watchQueryOptions = useWatchQueryOptions({ client: client, query: query, options: options });
    var fetchPolicy = watchQueryOptions.fetchPolicy, variables = watchQueryOptions.variables;
    var _a = options.queryKey, queryKey = _a === void 0 ? [] : _a;
    var didFetchResult = React__namespace.useRef(fetchPolicy !== "standby");
    didFetchResult.current || (didFetchResult.current = fetchPolicy !== "standby");
    var cacheKey = tslib.__spreadArray([
        query,
        cache.canonicalStringify(variables)
    ], [].concat(queryKey), true);
    var queryRef = suspenseCache.getQueryRef(cacheKey, function () {
        return client.watchQuery(watchQueryOptions);
    });
    var _b = React__namespace.useState(internal.wrapQueryRef(queryRef)), wrappedQueryRef = _b[0], setWrappedQueryRef = _b[1];
    if (internal.unwrapQueryRef(wrappedQueryRef) !== queryRef) {
        setWrappedQueryRef(internal.wrapQueryRef(queryRef));
    }
    if (queryRef.didChangeOptions(watchQueryOptions)) {
        var promise = queryRef.applyOptions(watchQueryOptions);
        internal.updateWrappedQueryRef(wrappedQueryRef, promise);
    }
    React__namespace.useEffect(function () {
        var id = setTimeout(function () {
            if (queryRef.disposed) {
                suspenseCache.add(cacheKey, queryRef);
            }
        });
        return function () { return clearTimeout(id); };
    });
    var fetchMore = React__namespace.useCallback(function (options) {
        var promise = queryRef.fetchMore(options);
        setWrappedQueryRef(internal.wrapQueryRef(queryRef));
        return promise;
    }, [queryRef]);
    var refetch = React__namespace.useCallback(function (variables) {
        var promise = queryRef.refetch(variables);
        setWrappedQueryRef(internal.wrapQueryRef(queryRef));
        return promise;
    }, [queryRef]);
    React__namespace.useEffect(function () { return queryRef.softRetain(); }, [queryRef]);
    return [
        didFetchResult.current ? wrappedQueryRef : void 0,
        {
            fetchMore: fetchMore,
            refetch: refetch,
            subscribeToMore: queryRef.observable.subscribeToMore,
        },
    ];
}

function useLoadableQuery(query, options) {
    if (options === void 0) { options = Object.create(null); }
    var client = useApolloClient(options.client);
    var suspenseCache = internal.getSuspenseCache(client);
    var watchQueryOptions = useWatchQueryOptions({ client: client, query: query, options: options });
    var _a = options.queryKey, queryKey = _a === void 0 ? [] : _a;
    var _b = React__namespace.useState(null), queryRef = _b[0], setQueryRef = _b[1];
    internal.assertWrappedQueryRef(queryRef);
    var internalQueryRef = queryRef && internal.unwrapQueryRef(queryRef);
    if (queryRef && (internalQueryRef === null || internalQueryRef === void 0 ? void 0 : internalQueryRef.didChangeOptions(watchQueryOptions))) {
        var promise = internalQueryRef.applyOptions(watchQueryOptions);
        internal.updateWrappedQueryRef(queryRef, promise);
    }
    var calledDuringRender = useRenderGuard();
    var fetchMore = React__namespace.useCallback(function (options) {
        if (!internalQueryRef) {
            throw new Error("The query has not been loaded. Please load the query.");
        }
        var promise = internalQueryRef.fetchMore(options);
        setQueryRef(internal.wrapQueryRef(internalQueryRef));
        return promise;
    }, [internalQueryRef]);
    var refetch = React__namespace.useCallback(function (options) {
        if (!internalQueryRef) {
            throw new Error("The query has not been loaded. Please load the query.");
        }
        var promise = internalQueryRef.refetch(options);
        setQueryRef(internal.wrapQueryRef(internalQueryRef));
        return promise;
    }, [internalQueryRef]);
    var loadQuery = React__namespace.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        globals.invariant(!calledDuringRender(), 51);
        var variables = args[0];
        var cacheKey = tslib.__spreadArray([
            query,
            cache.canonicalStringify(variables)
        ], [].concat(queryKey), true);
        var queryRef = suspenseCache.getQueryRef(cacheKey, function () {
            return client.watchQuery(tslib.__assign(tslib.__assign({}, watchQueryOptions), { variables: variables }));
        });
        setQueryRef(internal.wrapQueryRef(queryRef));
    }, [
        query,
        queryKey,
        suspenseCache,
        watchQueryOptions,
        calledDuringRender,
        client,
    ]);
    var subscribeToMore = React__namespace.useCallback(function (options) {
        globals.invariant(internalQueryRef, 52);
        return internalQueryRef.observable.subscribeToMore(options);
    }, [internalQueryRef]);
    var reset = React__namespace.useCallback(function () {
        setQueryRef(null);
    }, []);
    return [loadQuery, queryRef, { fetchMore: fetchMore, refetch: refetch, reset: reset, subscribeToMore: subscribeToMore }];
}

function useQueryRefHandlers(queryRef) {
    var unwrapped = internal.unwrapQueryRef(queryRef);
    return wrapHook("useQueryRefHandlers", _useQueryRefHandlers, unwrapped ?
        unwrapped["observable"]
        : useApolloClient())(queryRef);
}
function _useQueryRefHandlers(queryRef) {
    internal.assertWrappedQueryRef(queryRef);
    var _a = React__namespace.useState(queryRef), previousQueryRef = _a[0], setPreviousQueryRef = _a[1];
    var _b = React__namespace.useState(queryRef), wrappedQueryRef = _b[0], setWrappedQueryRef = _b[1];
    var internalQueryRef = internal.unwrapQueryRef(queryRef);
    if (previousQueryRef !== queryRef) {
        setPreviousQueryRef(queryRef);
        setWrappedQueryRef(queryRef);
    }
    else {
        internal.updateWrappedQueryRef(queryRef, internal.getWrappedPromise(wrappedQueryRef));
    }
    var refetch = React__namespace.useCallback(function (variables) {
        var promise = internalQueryRef.refetch(variables);
        setWrappedQueryRef(internal.wrapQueryRef(internalQueryRef));
        return promise;
    }, [internalQueryRef]);
    var fetchMore = React__namespace.useCallback(function (options) {
        var promise = internalQueryRef.fetchMore(options);
        setWrappedQueryRef(internal.wrapQueryRef(internalQueryRef));
        return promise;
    }, [internalQueryRef]);
    return {
        refetch: refetch,
        fetchMore: fetchMore,
        subscribeToMore: internalQueryRef.observable.subscribeToMore,
    };
}

function useReadQuery(queryRef) {
    var unwrapped = internal.unwrapQueryRef(queryRef);
    return wrapHook("useReadQuery", _useReadQuery, unwrapped ?
        unwrapped["observable"]
        : useApolloClient())(queryRef);
}
function _useReadQuery(queryRef) {
    internal.assertWrappedQueryRef(queryRef);
    var internalQueryRef = React__namespace.useMemo(function () { return internal.unwrapQueryRef(queryRef); }, [queryRef]);
    var getPromise = React__namespace.useCallback(function () { return internal.getWrappedPromise(queryRef); }, [queryRef]);
    if (internalQueryRef.disposed) {
        internalQueryRef.reinitialize();
        internal.updateWrappedQueryRef(queryRef, internalQueryRef.promise);
    }
    React__namespace.useEffect(function () { return internalQueryRef.retain(); }, [internalQueryRef]);
    var promise = useSyncExternalStore(React__namespace.useCallback(function (forceUpdate) {
        return internalQueryRef.listen(function (promise) {
            internal.updateWrappedQueryRef(queryRef, promise);
            forceUpdate();
        });
    }, [internalQueryRef, queryRef]), getPromise, getPromise);
    var result = __use(promise);
    return React__namespace.useMemo(function () {
        return {
            data: result.data,
            networkStatus: result.networkStatus,
            error: toApolloError(result),
        };
    }, [result]);
}

exports.skipToken = skipToken;
exports.useApolloClient = useApolloClient;
exports.useBackgroundQuery = useBackgroundQuery;
exports.useFragment = useFragment;
exports.useLazyQuery = useLazyQuery;
exports.useLoadableQuery = useLoadableQuery;
exports.useMutation = useMutation;
exports.useQuery = useQuery;
exports.useQueryRefHandlers = useQueryRefHandlers;
exports.useReactiveVar = useReactiveVar;
exports.useReadQuery = useReadQuery;
exports.useSubscription = useSubscription;
exports.useSuspenseQuery = useSuspenseQuery;
//# sourceMappingURL=hooks.cjs.map
