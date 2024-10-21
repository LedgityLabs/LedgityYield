import { extendSchema, parse, visit } from 'graphql';
import { removeDirectives, removeFieldIfDirectives } from './graphql.js';
export function transformDocumentWithApollo(doc, { keepClientFields }) {
    return visit(doc, {
        Field(node) {
            return keepClientFields
                ? removeDirectives(node, ['client'])
                : removeFieldIfDirectives(node, ['client']);
        },
    });
}
export function transformSchemaWithApollo(schema) {
    return extendSchema(schema, parse(/* GraphQL */ `
      directive @connection(key: String!, filter: [String]) on FIELD
    `));
}
