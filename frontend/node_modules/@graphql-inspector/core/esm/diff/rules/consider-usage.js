import { parsePath } from '../../utils/path.js';
import { CriticalityLevel } from '../changes/change.js';
export const considerUsage = async ({ changes, config }) => {
    if (!config) {
        throw new Error(`considerUsage rule is missing config`);
    }
    const collectedBreakingField = [];
    for (const change of changes) {
        if (change.criticality.level === CriticalityLevel.Breaking && change.path) {
            const [typeName, fieldName, argumentName] = parsePath(change.path);
            collectedBreakingField.push({
                type: typeName,
                field: fieldName,
                argument: argumentName,
                meta: {
                    change,
                },
            });
        }
    }
    // True if safe to break, false otherwise
    const usageList = await config.checkUsage(collectedBreakingField);
    // turns an array of booleans into an array of `Type.Field` strings
    // includes only those that are safe to break the api
    const suppressedPaths = collectedBreakingField
        .filter((_, i) => usageList[i] === true)
        .map(({ type, field, argument }) => [type, field, argument].filter(Boolean).join('.'));
    return changes.map(change => {
        // Turns those "safe to break" changes into "dangerous"
        if (change.criticality.level === CriticalityLevel.Breaking &&
            change.path &&
            suppressedPaths.some(p => change.path.startsWith(p))) {
            return {
                ...change,
                criticality: {
                    ...change.criticality,
                    level: CriticalityLevel.Dangerous,
                    isSafeBasedOnUsage: true,
                },
                message: `${change.message} (non-breaking based on usage)`,
            };
        }
        return change;
    });
};
