"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dangerousBreaking = void 0;
const change_js_1 = require("../changes/change.js");
const dangerousBreaking = ({ changes }) => {
    return changes.map(change => {
        if (change.criticality.level === change_js_1.CriticalityLevel.Dangerous) {
            return {
                ...change,
                criticality: {
                    ...change.criticality,
                    level: change_js_1.CriticalityLevel.Breaking,
                },
            };
        }
        return change;
    });
};
exports.dangerousBreaking = dangerousBreaking;
