import { GraphQLError, GraphQLSchema, Source } from 'graphql';
import { ValidateOperationComplexityConfig } from './complexity.js';
export interface InvalidDocument {
    source: Source;
    errors: GraphQLError[];
    deprecated: GraphQLError[];
}
export interface ValidateOptions {
    /**
     * Fails on duplicated fragment names
     * @default true
     */
    strictFragments?: boolean;
    /**
     * Fails on deprecated usage
     * @default true
     */
    strictDeprecated?: boolean;
    /**
     * Works only with combination of `apollo`
     * @default false
     */
    keepClientFields?: boolean;
    /**
     * Supports Apollo directives (`@client` and `@connection`)
     * @default false
     */
    apollo?: boolean;
    /**
     * Fails when operation depth exceeds maximum depth (including the referenced fragments).
     * @default Infinity
     */
    maxDepth?: number;
    /**
     * Fails when alias count exceeds maximum count (including the referenced fragments).
     * @default Infinity
     */
    maxAliasCount?: number;
    /**
     * Fails when the directive count exceeds maximum count for a single operation (including the referenced fragments).
     * @default Infinity
     */
    maxDirectiveCount?: number;
    /**
     * Fails when the token count exceeds maximum count for a single operation (including the referenced fragments).
     * @default Infinity
     */
    maxTokenCount?: number;
    /**
     * Fails when complexity score exceeds maximum complexity score (including the referenced fragments).
     * @default Infinity
     */
    validateComplexityConfig?: ValidateOperationComplexityConfig;
}
export declare function validate(schema: GraphQLSchema, sources: Source[], options?: ValidateOptions): InvalidDocument[];
