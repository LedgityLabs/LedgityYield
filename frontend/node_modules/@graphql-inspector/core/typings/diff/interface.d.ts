import { GraphQLInterfaceType } from 'graphql';
import { AddChange } from './schema.js';
export declare function changesInInterface(oldInterface: GraphQLInterfaceType, newInterface: GraphQLInterfaceType, addChange: AddChange): void;
