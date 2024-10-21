import type { Source } from 'graphql';
import { DocumentNode, GraphQLError } from 'graphql';
export declare function calculateTokenCount(args: {
    source: Source | string;
    getReferencedFragmentSource: (fragmentName: string) => Source | string | undefined;
}): number;
export declare function validateTokenCount(args: {
    source: Source;
    document: DocumentNode;
    getReferencedFragmentSource: (fragmentName: string) => Source | string | undefined;
    maxTokenCount: number;
}): GraphQLError | void;
