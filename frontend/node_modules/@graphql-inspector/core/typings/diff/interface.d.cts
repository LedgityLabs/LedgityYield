import { GraphQLInterfaceType } from 'graphql';
import { AddChange } from './schema.cjs';
export declare function changesInInterface(oldInterface: GraphQLInterfaceType, newInterface: GraphQLInterfaceType, addChange: AddChange): void;
