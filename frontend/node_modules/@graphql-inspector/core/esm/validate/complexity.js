import { GraphQLError, Kind } from 'graphql';
export function validateComplexity({ source, doc, maxComplexityScore, config, fragmentGraph, }) {
    const getFragmentByFragmentName = (fragmentName) => fragmentGraph.getNodeData(fragmentName);
    for (const definition of doc.definitions) {
        if (definition.kind !== Kind.OPERATION_DEFINITION) {
            continue;
        }
        const complexityScore = calculateOperationComplexity(definition, config, getFragmentByFragmentName);
        if (complexityScore > maxComplexityScore) {
            return new GraphQLError(`Too high complexity score (${complexityScore}). Maximum allowed is ${maxComplexityScore}`, [definition], source, definition.loc?.start ? [definition.loc.start] : undefined);
        }
    }
}
export function calculateOperationComplexity(node, config, getFragmentByName, depth = 0) {
    let cost = config.scalarCost;
    if ('selectionSet' in node && node.selectionSet) {
        cost = config.objectCost;
        for (const child of node.selectionSet.selections) {
            cost +=
                config.depthCostFactor *
                    calculateOperationComplexity(child, config, getFragmentByName, depth + 1);
        }
    }
    if (node.kind === Kind.FRAGMENT_SPREAD) {
        const fragment = getFragmentByName(node.name.value);
        if (fragment) {
            cost +=
                config.depthCostFactor *
                    calculateOperationComplexity(fragment, config, getFragmentByName, depth + 1);
        }
    }
    return cost;
}
