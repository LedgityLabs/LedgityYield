"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreDirectives = void 0;
const change_js_1 = require("../changes/change.js");
const ignoreDirectives = ({ changes, config }) => {
    if (!config?.ignoredDirectives?.length) {
        return changes;
    }
    const ignoredDirectiveSet = new Set(config.ignoredDirectives);
    const filteredChanges = changes.filter(change => {
        if (change.type === change_js_1.ChangeType && change.path) {
            const directiveName = change.path.split('.')[1];
            return !ignoredDirectiveSet.has(directiveName);
        }
        return true;
    });
    return filteredChanges;
};
exports.ignoreDirectives = ignoreDirectives;
