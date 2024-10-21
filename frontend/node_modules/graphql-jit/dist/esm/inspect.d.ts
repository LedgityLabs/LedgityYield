/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/jsutils/inspect.js
 */
export declare const nodejsCustomInspectSymbol: unique symbol;
export default function createInspect(maxArrayLength?: number, maxRecursiveDepth?: number): (value: any) => string;
