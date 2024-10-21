"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeUnreachable = void 0;
const graphql_js_1 = require("../../utils/graphql.js");
const path_js_1 = require("../../utils/path.js");
const change_js_1 = require("../changes/change.js");
const safeUnreachable = ({ changes, oldSchema }) => {
    const reachable = (0, graphql_js_1.getReachableTypes)(oldSchema);
    return changes.map(change => {
        if (change.criticality.level === change_js_1.CriticalityLevel.Breaking && change.path) {
            const [typeName] = (0, path_js_1.parsePath)(change.path);
            if (!reachable.has(typeName)) {
                return {
                    ...change,
                    criticality: {
                        ...change.criticality,
                        level: change_js_1.CriticalityLevel.NonBreaking,
                    },
                    message: 'Unreachable from root',
                };
            }
        }
        return change;
    });
};
exports.safeUnreachable = safeUnreachable;
