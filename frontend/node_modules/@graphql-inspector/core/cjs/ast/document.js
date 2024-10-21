"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDocument = void 0;
const graphql_1 = require("graphql");
function readDocument(source) {
    const result = {
        source,
        fragments: [],
        operations: [],
        hasFragments: false,
        hasOperations: false,
    };
    const documentNode = (0, graphql_1.parse)(source.body);
    const filepath = source.name;
    const definitions = documentNode.definitions || [];
    for (const node of definitions) {
        if (isOperation(node)) {
            result.operations.push({
                node,
                source: filepath,
            });
        }
        else if (isFragment(node)) {
            result.fragments.push({
                node,
                source: filepath,
            });
        }
    }
    result.hasFragments = result.fragments.length > 0;
    result.hasOperations = result.operations.length > 0;
    return result;
}
exports.readDocument = readDocument;
function isOperation(node) {
    return node.kind === graphql_1.Kind.OPERATION_DEFINITION;
}
function isFragment(node) {
    return node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
}
