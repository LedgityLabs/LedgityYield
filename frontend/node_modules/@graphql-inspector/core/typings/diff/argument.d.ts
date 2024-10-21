import { GraphQLArgument, GraphQLField, GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInArgument(type: GraphQLObjectType | GraphQLInterfaceType, field: GraphQLField<any, any, any>, oldArg: GraphQLArgument, newArg: GraphQLArgument, addChange: AddChange): void;
