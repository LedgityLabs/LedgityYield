import type { ASTNode, DirectiveNode, GraphQLSchema } from 'graphql';
export type DirectableASTNode = ASTNode & {
    directives?: readonly DirectiveNode[];
};
export type DirectableObject = {
    astNode?: DirectableASTNode | null;
    extensionASTNodes?: readonly DirectableASTNode[] | null;
    extensions?: {
        directives?: Record<string, any>;
    } | null;
};
export declare function getDirectiveExtensions<TDirectiveAnnotationsMap extends {
    [directiveName: string]: {
        [paramName: string]: any;
    };
}>(directableObj: DirectableObject, schema?: GraphQLSchema, pathToDirectivesInExtensions?: string[]): { [directiveName in keyof TDirectiveAnnotationsMap]?: TDirectiveAnnotationsMap[directiveName][] | undefined; };
