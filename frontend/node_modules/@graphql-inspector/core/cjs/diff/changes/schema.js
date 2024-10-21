"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaSubscriptionTypeChanged = exports.schemaSubscriptionTypeChangedFromMeta = exports.schemaMutationTypeChanged = exports.schemaMutationTypeChangedFromMeta = exports.schemaQueryTypeChanged = exports.schemaQueryTypeChangedFromMeta = void 0;
const change_js_1 = require("./change.js");
function buildSchemaQueryTypeChangedMessage(args) {
    return `Schema query root has changed from '${args.oldQueryTypeName}' to '${args.newQueryTypeName}'`;
}
function schemaQueryTypeChangedFromMeta(args) {
    return {
        type: change_js_1.ChangeType.SchemaQueryTypeChanged,
        criticality: {
            level: change_js_1.CriticalityLevel.Breaking,
        },
        message: buildSchemaQueryTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
exports.schemaQueryTypeChangedFromMeta = schemaQueryTypeChangedFromMeta;
function schemaQueryTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getQueryType() || {}).name || 'unknown';
    const newName = (newSchema.getQueryType() || {}).name || 'unknown';
    return schemaQueryTypeChangedFromMeta({
        type: change_js_1.ChangeType.SchemaQueryTypeChanged,
        meta: {
            oldQueryTypeName: oldName,
            newQueryTypeName: newName,
        },
    });
}
exports.schemaQueryTypeChanged = schemaQueryTypeChanged;
function buildSchemaMutationTypeChangedMessage(args) {
    return `Schema mutation root has changed from '${args.oldMutationTypeName}' to '${args.newMutationTypeName}'`;
}
function schemaMutationTypeChangedFromMeta(args) {
    return {
        type: change_js_1.ChangeType.SchemaMutationTypeChanged,
        criticality: {
            level: change_js_1.CriticalityLevel.Breaking,
        },
        message: buildSchemaMutationTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
exports.schemaMutationTypeChangedFromMeta = schemaMutationTypeChangedFromMeta;
function schemaMutationTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getMutationType() || {}).name || 'unknown';
    const newName = (newSchema.getMutationType() || {}).name || 'unknown';
    return schemaMutationTypeChangedFromMeta({
        type: change_js_1.ChangeType.SchemaMutationTypeChanged,
        meta: {
            newMutationTypeName: newName,
            oldMutationTypeName: oldName,
        },
    });
}
exports.schemaMutationTypeChanged = schemaMutationTypeChanged;
function buildSchemaSubscriptionTypeChangedMessage(args) {
    return `Schema subscription root has changed from '${args.oldSubscriptionTypeName}' to '${args.newSubscriptionTypeName}'`;
}
function schemaSubscriptionTypeChangedFromMeta(args) {
    return {
        type: change_js_1.ChangeType.SchemaSubscriptionTypeChanged,
        criticality: {
            level: change_js_1.CriticalityLevel.Breaking,
        },
        message: buildSchemaSubscriptionTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
exports.schemaSubscriptionTypeChangedFromMeta = schemaSubscriptionTypeChangedFromMeta;
function schemaSubscriptionTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getSubscriptionType() || {}).name || 'unknown';
    const newName = (newSchema.getSubscriptionType() || {}).name || 'unknown';
    return schemaSubscriptionTypeChangedFromMeta({
        type: change_js_1.ChangeType.SchemaSubscriptionTypeChanged,
        meta: {
            newSubscriptionTypeName: newName,
            oldSubscriptionTypeName: oldName,
        },
    });
}
exports.schemaSubscriptionTypeChanged = schemaSubscriptionTypeChanged;
