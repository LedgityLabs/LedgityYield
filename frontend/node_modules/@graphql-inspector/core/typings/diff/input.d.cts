import { GraphQLInputObjectType } from 'graphql';
import { AddChange } from './schema.cjs';
export declare function changesInInputObject(oldInput: GraphQLInputObjectType, newInput: GraphQLInputObjectType, addChange: AddChange): void;
