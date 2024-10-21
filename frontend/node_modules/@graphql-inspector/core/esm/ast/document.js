import { Kind, parse, } from 'graphql';
export function readDocument(source) {
    const result = {
        source,
        fragments: [],
        operations: [],
        hasFragments: false,
        hasOperations: false,
    };
    const documentNode = parse(source.body);
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
function isOperation(node) {
    return node.kind === Kind.OPERATION_DEFINITION;
}
function isFragment(node) {
    return node.kind === Kind.FRAGMENT_DEFINITION;
}
