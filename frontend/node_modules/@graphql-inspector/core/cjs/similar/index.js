"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.similar = void 0;
const graphql_1 = require("graphql");
const graphql_js_1 = require("../utils/graphql.js");
const string_js_1 = require("../utils/string.js");
function similar(schema, typeName, threshold = 0.4) {
    const typeMap = schema.getTypeMap();
    const targets = Object.keys(schema.getTypeMap())
        .filter(name => !(0, graphql_js_1.isPrimitive)(name) && !(0, graphql_js_1.isForIntrospection)(name))
        .map(name => ({
        typeId: name,
        value: stripType(typeMap[name]),
    }));
    const results = {};
    if (typeof typeName !== 'undefined' && !targets.some(t => t.typeId === typeName)) {
        throw new Error(`Type '${typeName}' doesn't exist`);
    }
    for (const source of typeName ? [{ typeId: typeName, value: '' }] : targets) {
        const sourceType = schema.getType(source.typeId);
        const matchWith = targets.filter(target => schema.getType(target.typeId).astNode.kind === sourceType.astNode.kind &&
            target.typeId !== source.typeId);
        if (matchWith.length > 0) {
            const found = similarTo(sourceType, matchWith, threshold);
            if (found) {
                results[source.typeId] = found;
            }
        }
    }
    return results;
}
exports.similar = similar;
function similarTo(type, targets, threshold) {
    const types = targets.filter(target => target.typeId !== type.name);
    const result = (0, string_js_1.findBestMatch)(stripType(type), types);
    if (result.bestMatch.rating < threshold) {
        return;
    }
    return {
        bestMatch: result.bestMatch,
        ratings: result.ratings
            .filter(r => r.rating >= threshold && r.target !== result.bestMatch.target)
            .sort((a, b) => a.rating - b.rating)
            .reverse(),
    };
}
function stripType(type) {
    return (0, graphql_1.printType)(type)
        .trim()
        .replace(/^[a-z]+ [^{]+\{/g, '')
        .replace(/\}$/g, '')
        .trim()
        .split('\n')
        .map(s => s.trim())
        .sort((a, b) => a.localeCompare(b))
        .join(' ');
}
