import { ChangeType } from '../changes/change.js';
export const ignoreDirectives = ({ changes, config }) => {
    if (!config?.ignoredDirectives?.length) {
        return changes;
    }
    const ignoredDirectiveSet = new Set(config.ignoredDirectives);
    const filteredChanges = changes.filter(change => {
        if (change.type === ChangeType && change.path) {
            const directiveName = change.path.split('.')[1];
            return !ignoredDirectiveSet.has(directiveName);
        }
        return true;
    });
    return filteredChanges;
};
