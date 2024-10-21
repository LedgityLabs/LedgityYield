import { GraphQLScalarType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInScalar(oldScalar: GraphQLScalarType, newScalar: GraphQLScalarType, addChange: AddChange): void;
