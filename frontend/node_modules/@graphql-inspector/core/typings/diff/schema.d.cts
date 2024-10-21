import { GraphQLSchema } from 'graphql';
import { Change } from './changes/change.cjs';
export type AddChange = (change: Change) => void;
export declare function diffSchema(oldSchema: GraphQLSchema, newSchema: GraphQLSchema): Change[];
