import { safeChangeForInputValue } from '../../utils/graphql.js';
import { safeString } from '../../utils/string.js';
import { ChangeType, CriticalityLevel, } from './change.js';
function buildFieldArgumentDescriptionChangedMessage(args) {
    return `Description for argument '${args.argumentName}' on field '${args.typeName}.${args.fieldName}' changed from '${args.oldDescription}' to '${args.newDescription}'`;
}
export function fieldArgumentDescriptionChangedFromMeta(args) {
    return {
        type: ChangeType.FieldArgumentDescriptionChanged,
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        message: buildFieldArgumentDescriptionChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.typeName, args.meta.fieldName, args.meta.argumentName].join('.'),
    };
}
export function fieldArgumentDescriptionChanged(type, field, oldArg, newArg) {
    return fieldArgumentDescriptionChangedFromMeta({
        type: ChangeType.FieldArgumentDescriptionChanged,
        meta: {
            typeName: type.name,
            fieldName: field.name,
            argumentName: oldArg.name,
            oldDescription: oldArg.description ?? null,
            newDescription: newArg.description ?? null,
        },
    });
}
function buildFieldArgumentDefaultChangedMessage(args) {
    return args.oldDefaultValue === undefined
        ? `Default value '${args.newDefaultValue}' was added to argument '${args.argumentName}' on field '${args.typeName}.${args.fieldName}'`
        : `Default value for argument '${args.argumentName}' on field '${args.typeName}.${args.fieldName}' changed from '${args.oldDefaultValue}' to '${args.newDefaultValue}'`;
}
const fieldArgumentDefaultChangedCriticalityDangerousReason = 'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.';
export function fieldArgumentDefaultChangedFromMeta(args) {
    return {
        type: ChangeType.FieldArgumentDefaultChanged,
        criticality: {
            level: CriticalityLevel.Dangerous,
            reason: fieldArgumentDefaultChangedCriticalityDangerousReason,
        },
        message: buildFieldArgumentDefaultChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.typeName, args.meta.fieldName, args.meta.argumentName].join('.'),
    };
}
export function fieldArgumentDefaultChanged(type, field, oldArg, newArg) {
    const meta = {
        typeName: type.name,
        fieldName: field.name,
        argumentName: newArg.name,
    };
    if (oldArg.defaultValue !== undefined) {
        meta.oldDefaultValue = safeString(oldArg.defaultValue);
    }
    if (newArg.defaultValue !== undefined) {
        meta.newDefaultValue = safeString(newArg.defaultValue);
    }
    return fieldArgumentDefaultChangedFromMeta({
        type: ChangeType.FieldArgumentDefaultChanged,
        meta,
    });
}
function buildFieldArgumentTypeChangedMessage(args) {
    return `Type for argument '${args.argumentName}' on field '${args.typeName}.${args.fieldName}' changed from '${args.oldArgumentType}' to '${args.newArgumentType}'`;
}
const fieldArgumentTypeChangedCriticalityNonBreakingReason = `Changing an input field from non-null to null is considered non-breaking.`;
const fieldArgumentTypeChangedCriticalityBreakingReason = `Changing the type of a field's argument can cause existing queries that use this argument to error.`;
export function fieldArgumentTypeChangedFromMeta(args) {
    return {
        type: ChangeType.FieldArgumentTypeChanged,
        criticality: args.meta.isSafeArgumentTypeChange
            ? {
                level: CriticalityLevel.NonBreaking,
                reason: fieldArgumentTypeChangedCriticalityNonBreakingReason,
            }
            : {
                level: CriticalityLevel.Breaking,
                reason: fieldArgumentTypeChangedCriticalityBreakingReason,
            },
        message: buildFieldArgumentTypeChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.typeName, args.meta.fieldName, args.meta.argumentName].join('.'),
    };
}
export function fieldArgumentTypeChanged(type, field, oldArg, newArg) {
    return fieldArgumentTypeChangedFromMeta({
        type: ChangeType.FieldArgumentTypeChanged,
        meta: {
            typeName: type.name,
            fieldName: field.name,
            argumentName: newArg.name,
            oldArgumentType: oldArg.type.toString(),
            newArgumentType: newArg.type.toString(),
            isSafeArgumentTypeChange: safeChangeForInputValue(oldArg.type, newArg.type),
        },
    });
}
