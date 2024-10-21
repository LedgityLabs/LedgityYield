import { GraphQLEnumType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInEnum(oldEnum: GraphQLEnumType, newEnum: GraphQLEnumType, addChange: AddChange): void;
