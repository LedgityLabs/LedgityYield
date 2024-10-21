import { GraphQLSchema } from 'graphql';
import { Change } from './changes/change.js';
import * as rules from './rules/index.js';
import { Rule } from './rules/types.js';
export * from './rules/types.js';
export declare const DiffRule: typeof rules;
export * from './onComplete/types.js';
export type { UsageHandler } from './rules/consider-usage.js';
export declare function diff(oldSchema: GraphQLSchema, newSchema: GraphQLSchema, rules?: Rule[], config?: rules.ConsiderUsageConfig): Promise<Change[]>;
