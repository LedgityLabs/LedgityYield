import { GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInField(type: GraphQLObjectType | GraphQLInterfaceType, oldField: GraphQLField<any, any>, newField: GraphQLField<any, any>, addChange: AddChange): void;
