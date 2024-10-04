"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const shared_js_1 = require("./shared.js");
const rootOperations = new Set(['Query', 'Mutation', 'Subscription']);
class BarePrefix {
    constructor(options) {
        this.noWrap = true;
        const { apiName, config } = options;
        this.ignoreList = [...(config.ignore || []), ...shared_js_1.ignoreList];
        this.includeRootOperations = config.includeRootOperations === true;
        this.includeTypes = config.includeTypes !== false;
        this.prefix = null;
        if (config.value) {
            this.prefix = config.value;
        }
        else if (apiName) {
            this.prefix = `${apiName}_`;
        }
        if (!this.prefix) {
            throw new Error(`Transform 'prefix' has missing config: prefix`);
        }
    }
    transformSchema(schema) {
        return (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.TYPE]: (type) => {
                if (this.includeTypes && !(0, graphql_1.isSpecifiedScalarType)(type)) {
                    const currentName = type.name;
                    if (!this.ignoreList.includes(currentName)) {
                        return (0, utils_1.renameType)(type, this.prefix + currentName);
                    }
                }
                return undefined;
            },
            [utils_1.MapperKind.ABSTRACT_TYPE]: type => {
                if (this.includeTypes && !(0, graphql_1.isSpecifiedScalarType)(type)) {
                    const existingResolver = type.resolveType;
                    type.resolveType = async (data, context, info, abstractType) => {
                        const typeName = await existingResolver(data, context, info, abstractType);
                        return this.prefix + typeName;
                    };
                    const currentName = type.name;
                    return (0, utils_1.renameType)(type, this.prefix + currentName);
                }
                return undefined;
            },
            [utils_1.MapperKind.ROOT_OBJECT]() {
                return undefined;
            },
            ...(this.includeRootOperations && {
                [utils_1.MapperKind.COMPOSITE_FIELD]: (fieldConfig, fieldName, typeName) => {
                    return !rootOperations.has(typeName) || // check we're in a root Type
                        this.ignoreList.includes(typeName) || // check if type is to be ignored
                        this.ignoreList.includes(`${typeName}.${fieldName}`) // check if field in type is to be ignored
                        ? undefined // do not perform any change
                        : [`${this.prefix}${fieldName}`, fieldConfig]; // apply prefix
                },
            }),
        });
    }
}
exports.default = BarePrefix;
