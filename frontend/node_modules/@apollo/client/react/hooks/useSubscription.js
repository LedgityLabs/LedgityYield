import { __assign } from "tslib";
import { invariant } from "../../utilities/globals/index.js";
import * as React from "rehackt";
import { equal } from "@wry/equality";
import { DocumentType, verifyDocumentType } from "../parser/index.js";
import { ApolloError, Observable } from "../../core/index.js";
import { useApolloClient } from "./useApolloClient.js";
import { useDeepMemo } from "./internal/useDeepMemo.js";
import { useSyncExternalStore } from "./useSyncExternalStore.js";
import { toApolloError } from "./useQuery.js";
import { useIsomorphicLayoutEffect } from "./internal/useIsomorphicLayoutEffect.js";
/**
 * > Refer to the [Subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) section for a more in-depth overview of `useSubscription`.
 *
 * @example
 * ```jsx
 * const COMMENTS_SUBSCRIPTION = gql`
 *   subscription OnCommentAdded($repoFullName: String!) {
 *     commentAdded(repoFullName: $repoFullName) {
 *       id
 *       content
 *     }
 *   }
 * `;
 *
 * function DontReadTheComments({ repoFullName }) {
 *   const {
 *     data: { commentAdded },
 *     loading,
 *   } = useSubscription(COMMENTS_SUBSCRIPTION, { variables: { repoFullName } });
 *   return <h4>New comment: {!loading && commentAdded.content}</h4>;
 * }
 * ```
 * @remarks
 * #### Consider using `onData` instead of `useEffect`
 *
 * If you want to react to incoming data, please use the `onData` option instead of `useEffect`.
 * State updates you make inside a `useEffect` hook might cause additional rerenders, and `useEffect` is mostly meant for side effects of rendering, not as an event handler.
 * State updates made in an event handler like `onData` might - depending on the React version - be batched and cause only a single rerender.
 *
 * Consider the following component:
 *
 * ```jsx
 * export function Subscriptions() {
 *   const { data, error, loading } = useSubscription(query);
 *   const [accumulatedData, setAccumulatedData] = useState([]);
 *
 *   useEffect(() => {
 *     setAccumulatedData((prev) => [...prev, data]);
 *   }, [data]);
 *
 *   return (
 *     <>
 *       {loading && <p>Loading...</p>}
 *       {JSON.stringify(accumulatedData, undefined, 2)}
 *     </>
 *   );
 * }
 * ```
 *
 * Instead of using `useEffect` here, we can re-write this component to use the `onData` callback function accepted in `useSubscription`'s `options` object:
 *
 * ```jsx
 * export function Subscriptions() {
 *   const [accumulatedData, setAccumulatedData] = useState([]);
 *   const { data, error, loading } = useSubscription(
 *     query,
 *     {
 *       onData({ data }) {
 *         setAccumulatedData((prev) => [...prev, data])
 *       }
 *     }
 *   );
 *
 *   return (
 *     <>
 *       {loading && <p>Loading...</p>}
 *       {JSON.stringify(accumulatedData, undefined, 2)}
 *     </>
 *   );
 * }
 * ```
 *
 * > ⚠️ **Note:** The `useSubscription` option `onData` is available in Apollo Client >= 3.7. In previous versions, the equivalent option is named `onSubscriptionData`.
 *
 * Now, the first message will be added to the `accumulatedData` array since `onData` is called _before_ the component re-renders. React 18 automatic batching is still in effect and results in a single re-render, but with `onData` we can guarantee each message received after the component mounts is added to `accumulatedData`.
 *
 * @since 3.0.0
 * @param subscription - A GraphQL subscription document parsed into an AST by `gql`.
 * @param options - Options to control how the subscription is executed.
 * @returns Query result object
 */
export function useSubscription(subscription, options) {
    if (options === void 0) { options = Object.create(null); }
    var hasIssuedDeprecationWarningRef = React.useRef(false);
    var client = useApolloClient(options.client);
    verifyDocumentType(subscription, DocumentType.Subscription);
    if (!hasIssuedDeprecationWarningRef.current) {
        hasIssuedDeprecationWarningRef.current = true;
        if (options.onSubscriptionData) {
            globalThis.__DEV__ !== false && invariant.warn(options.onData ? 53 : 54);
        }
        if (options.onSubscriptionComplete) {
            globalThis.__DEV__ !== false && invariant.warn(options.onComplete ? 55 : 56);
        }
    }
    var skip = options.skip, fetchPolicy = options.fetchPolicy, errorPolicy = options.errorPolicy, shouldResubscribe = options.shouldResubscribe, context = options.context, extensions = options.extensions, ignoreResults = options.ignoreResults;
    var variables = useDeepMemo(function () { return options.variables; }, [options.variables]);
    var recreate = function () {
        return createSubscription(client, subscription, variables, fetchPolicy, errorPolicy, context, extensions);
    };
    var _a = React.useState(options.skip ? null : recreate), observable = _a[0], setObservable = _a[1];
    var recreateRef = React.useRef(recreate);
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
            !equal(variables, observable.__.variables)) &&
            (typeof shouldResubscribe === "function" ?
                !!shouldResubscribe(options)
                : shouldResubscribe) !== false)) {
        setObservable((observable = recreate()));
    }
    var optionsRef = React.useRef(options);
    React.useEffect(function () {
        optionsRef.current = options;
    });
    var fallbackLoading = !skip && !ignoreResults;
    var fallbackResult = React.useMemo(function () { return ({
        loading: fallbackLoading,
        error: void 0,
        data: void 0,
        variables: variables,
    }); }, [fallbackLoading, variables]);
    var ignoreResultsRef = React.useRef(ignoreResults);
    useIsomorphicLayoutEffect(function () {
        // We cannot reference `ignoreResults` directly in the effect below
        // it would add a dependency to the `useEffect` deps array, which means the
        // subscription would be recreated if `ignoreResults` changes
        // As a result, on resubscription, the last result would be re-delivered,
        // rendering the component one additional time, and re-triggering `onData`.
        // The same applies to `fetchPolicy`, which results in a new `observable`
        // being created. We cannot really avoid it in that case, but we can at least
        // avoid it for `ignoreResults`.
        ignoreResultsRef.current = ignoreResults;
    });
    var ret = useSyncExternalStore(React.useCallback(function (update) {
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
                    // TODO: fetchResult.data can be null but SubscriptionResult.data
                    // expects TData | undefined only
                    data: fetchResult.data,
                    error: toApolloError(fetchResult),
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
                    error instanceof ApolloError ? error : (new ApolloError({ protocolErrors: [error] }));
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
            // immediately stop receiving subscription values, but do not unsubscribe
            // until after a short delay in case another useSubscription hook is
            // reusing the same underlying observable and is about to subscribe
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
    var restart = React.useCallback(function () {
        invariant(!optionsRef.current.skip, 57);
        setObservable(recreateRef.current());
    }, [optionsRef, recreateRef]);
    return React.useMemo(function () { return (__assign(__assign({}, ret), { restart: restart })); }, [ret, restart]);
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
    var __ = __assign(__assign({}, options), { client: client, result: {
            loading: true,
            data: void 0,
            error: void 0,
            variables: variables,
        }, setResult: function (result) {
            __.result = result;
        } });
    var observable = null;
    return Object.assign(new Observable(function (observer) {
        // lazily start the subscription when the first observer subscribes
        // to get around strict mode
        if (!observable) {
            observable = client.subscribe(options);
        }
        var sub = observable.subscribe(observer);
        return function () { return sub.unsubscribe(); };
    }), {
        /**
         * A tracking object to store details about the observable and the latest result of the subscription.
         */
        __: __,
    });
}
//# sourceMappingURL=useSubscription.js.map