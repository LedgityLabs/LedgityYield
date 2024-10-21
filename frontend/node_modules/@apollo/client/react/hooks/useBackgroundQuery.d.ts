import type { DocumentNode, OperationVariables, TypedDocumentNode } from "../../core/index.js";
import type { QueryRef } from "../internal/index.js";
import type { BackgroundQueryHookOptions, NoInfer } from "../types/types.js";
import type { FetchMoreFunction, RefetchFunction, SubscribeToMoreFunction } from "./useSuspenseQuery.js";
import type { DeepPartial } from "../../utilities/index.js";
import type { SkipToken } from "./constants.js";
export type UseBackgroundQueryResult<TData = unknown, TVariables extends OperationVariables = OperationVariables> = {
    /**
     * A function that enables you to execute a [subscription](https://www.apollographql.com/docs/react/data/subscriptions/), usually to subscribe to specific fields that were included in the query.
     * 
     * This function returns _another_ function that you can call to terminate the subscription.
     */
    subscribeToMore: SubscribeToMoreFunction<TData, TVariables>;
    /**
     * A function that helps you fetch the next set of results for a [paginated list field](https://www.apollographql.com/docs/react/pagination/core-api/).
     */
    fetchMore: FetchMoreFunction<TData, TVariables>;
    /**
     * Update the variables of this observable query, and fetch the new results. This method should be preferred over `setVariables` in most use cases.
     * 
     * @param variables - The new set of variables. If there are missing variables, the previous values of those variables will be used.
     */
    refetch: RefetchFunction<TData, TVariables>;
};
type BackgroundQueryHookOptionsNoInfer<TData, TVariables extends OperationVariables> = BackgroundQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>;
export declare function useBackgroundQuery<TData, TVariables extends OperationVariables, TOptions extends Omit<BackgroundQueryHookOptions<TData>, "variables">>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & TOptions): [
    (QueryRef<TOptions["errorPolicy"] extends "ignore" | "all" ? TOptions["returnPartialData"] extends true ? DeepPartial<TData> | undefined : TData | undefined : TOptions["returnPartialData"] extends true ? DeepPartial<TData> : TData, TVariables> | (TOptions["skip"] extends boolean ? undefined : never)),
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    returnPartialData: true;
    errorPolicy: "ignore" | "all";
}): [
    QueryRef<DeepPartial<TData> | undefined, TVariables>,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    errorPolicy: "ignore" | "all";
}): [
    QueryRef<TData | undefined, TVariables>,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    skip: boolean;
    returnPartialData: true;
}): [
    QueryRef<DeepPartial<TData>, TVariables> | undefined,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    returnPartialData: true;
}): [
    QueryRef<DeepPartial<TData>, TVariables>,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    skip: boolean;
}): [
    QueryRef<TData, TVariables> | undefined,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: BackgroundQueryHookOptionsNoInfer<TData, TVariables>): [QueryRef<TData, TVariables>, UseBackgroundQueryResult<TData, TVariables>];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SkipToken): [undefined, UseBackgroundQueryResult<TData, TVariables>];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options: SkipToken | (BackgroundQueryHookOptionsNoInfer<TData, TVariables> & {
    returnPartialData: true;
})): [
    QueryRef<DeepPartial<TData>, TVariables> | undefined,
    UseBackgroundQueryResult<TData, TVariables>
];
export declare function useBackgroundQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SkipToken | BackgroundQueryHookOptionsNoInfer<TData, TVariables>): [
    QueryRef<TData, TVariables> | undefined,
    UseBackgroundQueryResult<TData, TVariables>
];
export {};
//# sourceMappingURL=useBackgroundQuery.d.ts.map