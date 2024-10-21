import { GraphQLObjectType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInObject(oldType: GraphQLObjectType, newType: GraphQLObjectType, addChange: AddChange): void;
