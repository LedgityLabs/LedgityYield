import { GraphQLSchema } from 'graphql';
import { Change } from './changes/change.cjs';
import * as rules from './rules/index.cjs';
import { Rule } from './rules/types.cjs';
export * from './rules/types.cjs';
export declare const DiffRule: typeof rules;
export * from './onComplete/types.cjs';
export type { UsageHandler } from './rules/consider-usage.cjs';
export declare function diff(oldSchema: GraphQLSchema, newSchema: GraphQLSchema, rules?: Rule[], config?: rules.ConsiderUsageConfig): Promise<Change[]>;
