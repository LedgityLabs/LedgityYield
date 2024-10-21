import { GraphQLSchema } from 'graphql';
import { Change } from '../changes/change.cjs';
export type Rule<TConfig = any> = (input: {
    changes: Change[];
    oldSchema: GraphQLSchema;
    newSchema: GraphQLSchema;
    config: TConfig;
}) => Change[] | Promise<Change[]>;
