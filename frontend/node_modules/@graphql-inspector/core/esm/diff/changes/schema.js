import { ChangeType, CriticalityLevel, } from './change.js';
function buildSchemaQueryTypeChangedMessage(args) {
    return `Schema query root has changed from '${args.oldQueryTypeName}' to '${args.newQueryTypeName}'`;
}
export function schemaQueryTypeChangedFromMeta(args) {
    return {
        type: ChangeType.SchemaQueryTypeChanged,
        criticality: {
            level: CriticalityLevel.Breaking,
        },
        message: buildSchemaQueryTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
export function schemaQueryTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getQueryType() || {}).name || 'unknown';
    const newName = (newSchema.getQueryType() || {}).name || 'unknown';
    return schemaQueryTypeChangedFromMeta({
        type: ChangeType.SchemaQueryTypeChanged,
        meta: {
            oldQueryTypeName: oldName,
            newQueryTypeName: newName,
        },
    });
}
function buildSchemaMutationTypeChangedMessage(args) {
    return `Schema mutation root has changed from '${args.oldMutationTypeName}' to '${args.newMutationTypeName}'`;
}
export function schemaMutationTypeChangedFromMeta(args) {
    return {
        type: ChangeType.SchemaMutationTypeChanged,
        criticality: {
            level: CriticalityLevel.Breaking,
        },
        message: buildSchemaMutationTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
export function schemaMutationTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getMutationType() || {}).name || 'unknown';
    const newName = (newSchema.getMutationType() || {}).name || 'unknown';
    return schemaMutationTypeChangedFromMeta({
        type: ChangeType.SchemaMutationTypeChanged,
        meta: {
            newMutationTypeName: newName,
            oldMutationTypeName: oldName,
        },
    });
}
function buildSchemaSubscriptionTypeChangedMessage(args) {
    return `Schema subscription root has changed from '${args.oldSubscriptionTypeName}' to '${args.newSubscriptionTypeName}'`;
}
export function schemaSubscriptionTypeChangedFromMeta(args) {
    return {
        type: ChangeType.SchemaSubscriptionTypeChanged,
        criticality: {
            level: CriticalityLevel.Breaking,
        },
        message: buildSchemaSubscriptionTypeChangedMessage(args.meta),
        meta: args.meta,
    };
}
export function schemaSubscriptionTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getSubscriptionType() || {}).name || 'unknown';
    const newName = (newSchema.getSubscriptionType() || {}).name || 'unknown';
    return schemaSubscriptionTypeChangedFromMeta({
        type: ChangeType.SchemaSubscriptionTypeChanged,
        meta: {
            newSubscriptionTypeName: newName,
            oldSubscriptionTypeName: oldName,
        },
    });
}
