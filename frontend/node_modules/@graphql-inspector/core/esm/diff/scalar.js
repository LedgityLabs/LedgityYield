import { Kind } from 'graphql';
import { compareLists } from '../utils/compare.js';
import { directiveUsageAdded, directiveUsageRemoved } from './changes/directive-usage.js';
export function changesInScalar(oldScalar, newScalar, addChange) {
    compareLists(oldScalar.astNode?.directives || [], newScalar.astNode?.directives || [], {
        onAdded(directive) {
            addChange(directiveUsageAdded(Kind.SCALAR_TYPE_DEFINITION, directive, newScalar));
        },
        onRemoved(directive) {
            addChange(directiveUsageRemoved(Kind.SCALAR_TYPE_DEFINITION, directive, oldScalar));
        },
    });
}
