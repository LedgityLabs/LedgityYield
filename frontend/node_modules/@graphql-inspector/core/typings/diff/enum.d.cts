import { GraphQLEnumType } from 'graphql';
import { AddChange } from './schema.cjs';
export declare function changesInEnum(oldEnum: GraphQLEnumType, newEnum: GraphQLEnumType, addChange: AddChange): void;
