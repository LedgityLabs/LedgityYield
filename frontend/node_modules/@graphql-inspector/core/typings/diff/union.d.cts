import { GraphQLUnionType } from 'graphql';
import { AddChange } from './schema.cjs';
export declare function changesInUnion(oldUnion: GraphQLUnionType, newUnion: GraphQLUnionType, addChange: AddChange): void;
