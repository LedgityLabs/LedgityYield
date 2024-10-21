"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppressRemovalOfDeprecatedField = void 0;
const graphql_1 = require("graphql");
const is_deprecated_js_1 = require("../../utils/is-deprecated.js");
const path_js_1 = require("../../utils/path.js");
const change_js_1 = require("../changes/change.js");
const suppressRemovalOfDeprecatedField = ({ changes, oldSchema, newSchema }) => {
    return changes.map(change => {
        if (change.type === change_js_1.ChangeType.FieldRemoved &&
            change.criticality.level === change_js_1.CriticalityLevel.Breaking &&
            change.path) {
            const [typeName, fieldName] = (0, path_js_1.parsePath)(change.path);
            const type = oldSchema.getType(typeName);
            if ((0, graphql_1.isObjectType)(type) || (0, graphql_1.isInterfaceType)(type)) {
                const field = type.getFields()[fieldName];
                if ((0, is_deprecated_js_1.isDeprecated)(field)) {
                    return {
                        ...change,
                        criticality: {
                            ...change.criticality,
                            level: change_js_1.CriticalityLevel.Dangerous,
                        },
                    };
                }
            }
        }
        if (change.type === change_js_1.ChangeType.EnumValueRemoved &&
            change.criticality.level === change_js_1.CriticalityLevel.Breaking &&
            change.path) {
            const [enumName, enumItem] = (0, path_js_1.parsePath)(change.path);
            const type = oldSchema.getType(enumName);
            if ((0, graphql_1.isEnumType)(type)) {
                const item = type.getValue(enumItem);
                if (item && (0, is_deprecated_js_1.isDeprecated)(item)) {
                    return {
                        ...change,
                        criticality: {
                            ...change.criticality,
                            level: change_js_1.CriticalityLevel.Dangerous,
                        },
                    };
                }
            }
        }
        if (change.type === change_js_1.ChangeType.InputFieldRemoved &&
            change.criticality.level === change_js_1.CriticalityLevel.Breaking &&
            change.path) {
            const [inputName, inputItem] = (0, path_js_1.parsePath)(change.path);
            const type = oldSchema.getType(inputName);
            if ((0, graphql_1.isInputObjectType)(type)) {
                const item = type.getFields()[inputItem];
                if (item && (0, is_deprecated_js_1.isDeprecated)(item)) {
                    return {
                        ...change,
                        criticality: {
                            ...change.criticality,
                            level: change_js_1.CriticalityLevel.Dangerous,
                        },
                    };
                }
            }
        }
        if (change.type === change_js_1.ChangeType.TypeRemoved &&
            change.criticality.level === change_js_1.CriticalityLevel.Breaking &&
            change.path) {
            const [typeName] = (0, path_js_1.parsePath)(change.path);
            const type = newSchema.getType(typeName);
            if (!type) {
                return {
                    ...change,
                    criticality: {
                        ...change.criticality,
                        level: change_js_1.CriticalityLevel.Dangerous,
                    },
                };
            }
        }
        return change;
    });
};
exports.suppressRemovalOfDeprecatedField = suppressRemovalOfDeprecatedField;
