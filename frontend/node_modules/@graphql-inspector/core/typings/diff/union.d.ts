import { GraphQLUnionType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInUnion(oldUnion: GraphQLUnionType, newUnion: GraphQLUnionType, addChange: AddChange): void;
