/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/error/GraphQLError.js
 */
import { SourceLocation } from "graphql";
export declare function GraphQLError(message: string, locations?: ReadonlyArray<SourceLocation>, path?: ReadonlyArray<string | number>, originalError?: Error & {
    extensions?: any;
}, skipStackCapturing?: boolean): void;
