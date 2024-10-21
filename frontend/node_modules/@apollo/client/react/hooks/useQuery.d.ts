import type { ApolloClient, DefaultOptions, OperationVariables, WatchQueryFetchPolicy } from "../../core/index.js";
import { ApolloError } from "../../errors/index.js";
import type { ApolloQueryResult, ObservableQuery, DocumentNode, TypedDocumentNode, WatchQueryOptions } from "../../core/index.js";
import type { QueryHookOptions, QueryResult, ObservableQueryFields, NoInfer } from "../types/types.js";
import { useApolloClient } from "./useApolloClient.js";
type InternalQueryResult<TData, TVariables extends OperationVariables> = Omit<QueryResult<TData, TVariables>, Exclude<keyof ObservableQueryFields<TData, TVariables>, "variables">>;
export declare const lastWatchOptions: unique symbol;
export interface ObsQueryWithMeta<TData, TVariables extends OperationVariables> extends ObservableQuery<TData, TVariables> {
    [lastWatchOptions]?: WatchQueryOptions<TVariables, TData>;
}
export interface InternalResult<TData, TVariables extends OperationVariables> {
    current?: undefined | InternalQueryResult<TData, TVariables>;
    previousData?: undefined | TData;
}
interface InternalState<TData, TVariables extends OperationVariables> {
    client: ReturnType<typeof useApolloClient>;
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    observable: ObsQueryWithMeta<TData, TVariables>;
    resultData: InternalResult<TData, TVariables>;
}
export type UpdateInternalState<TData, TVariables extends OperationVariables> = (state: InternalState<TData, TVariables>) => void;
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
export declare function useQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>): QueryResult<TData, TVariables>;
export declare function useQueryInternals<TData = any, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>): {
    result: InternalQueryResult<TData, TVariables> | InternalQueryResult<any, TVariables>;
    obsQueryFields: Omit<ObservableQueryFields<TData, TVariables>, "variables">;
    observable: ObsQueryWithMeta<TData, TVariables>;
    resultData: InternalResult<TData, TVariables>;
    client: ApolloClient<object>;
    onQueryExecuted: (watchQueryOptions: WatchQueryOptions<TVariables, TData>) => void;
};
export declare function createMakeWatchQueryOptions<TData = any, TVariables extends OperationVariables = OperationVariables>(client: ApolloClient<object>, query: DocumentNode | TypedDocumentNode<TData, TVariables>, { skip, ssr, onCompleted, onError, defaultOptions, ...otherOptions }: QueryHookOptions<TData, TVariables> | undefined, isSyncSSR: boolean): (observable?: ObservableQuery<TData, TVariables>) => WatchQueryOptions<TVariables, TData>;
export declare function getObsQueryOptions<TData, TVariables extends OperationVariables>(observable: ObservableQuery<TData, TVariables> | undefined, client: ApolloClient<object>, queryHookOptions: QueryHookOptions<TData, TVariables>, watchQueryOptions: Partial<WatchQueryOptions<TVariables, TData>>): WatchQueryOptions<TVariables, TData>;
export declare function getDefaultFetchPolicy<TData, TVariables extends OperationVariables>(queryHookDefaultOptions?: Partial<WatchQueryOptions<TVariables, TData>>, clientDefaultOptions?: DefaultOptions): WatchQueryFetchPolicy;
export declare function toApolloError<TData>(result: Pick<ApolloQueryResult<TData>, "errors" | "error">): ApolloError | undefined;
export declare function toQueryResult<TData, TVariables extends OperationVariables>(result: ApolloQueryResult<TData>, previousData: TData | undefined, observable: ObservableQuery<TData, TVariables>, client: ApolloClient<object>): InternalQueryResult<TData, TVariables>;
export {};
//# sourceMappingURL=useQuery.d.ts.map