import { GraphQLSchema } from 'graphql';
import { BestMatch } from '../utils/string.js';
export interface SimilarMap {
    [name: string]: BestMatch;
}
export declare function similar(schema: GraphQLSchema, typeName: string | undefined, threshold?: number): SimilarMap;
