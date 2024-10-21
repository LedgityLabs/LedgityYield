import { BaseDocumentsVisitor, DeclarationKind, LoadedFragment, NormalizedAvoidOptionalsConfig, ParsedDocumentsConfig } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema } from 'graphql';
import { TypeScriptDocumentsPluginConfig } from './config.js';
export interface TypeScriptDocumentsParsedConfig extends ParsedDocumentsConfig {
    arrayInputCoercion: boolean;
    avoidOptionals: NormalizedAvoidOptionalsConfig;
    immutableTypes: boolean;
    noExport: boolean;
    maybeValue: string;
    allowUndefinedQueryVariables: boolean;
}
export declare class TypeScriptDocumentsVisitor extends BaseDocumentsVisitor<TypeScriptDocumentsPluginConfig, TypeScriptDocumentsParsedConfig> {
    constructor(schema: GraphQLSchema, config: TypeScriptDocumentsPluginConfig, allFragments: LoadedFragment[]);
    getImports(): Array<string>;
    protected getPunctuation(_declarationKind: DeclarationKind): string;
    protected applyVariablesWrapper(variablesBlock: string, operationType: string): string;
}
