import { isNonNullType } from 'graphql';
import { safeChangeForInputValue } from '../../utils/graphql.js';
import { isDeprecated } from '../../utils/is-deprecated.js';
import { safeString } from '../../utils/string.js';
import { ChangeType, CriticalityLevel, } from './change.js';
function buildInputFieldRemovedMessage(args) {
    return `Input field '${args.removedFieldName}' ${args.isInputFieldDeprecated ? '(deprecated) ' : ''}was removed from input object type '${args.inputName}'`;
}
export function inputFieldRemovedFromMeta(args) {
    return {
        type: ChangeType.InputFieldRemoved,
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: 'Removing an input field will cause existing queries that use this input field to error.',
        },
        message: buildInputFieldRemovedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.removedFieldName].join('.'),
    };
}
export function inputFieldRemoved(input, field) {
    return inputFieldRemovedFromMeta({
        type: ChangeType.InputFieldRemoved,
        meta: {
            inputName: input.name,
            removedFieldName: field.name,
            isInputFieldDeprecated: isDeprecated(field),
        },
    });
}
export function buildInputFieldAddedMessage(args) {
    return `Input field '${args.addedInputFieldName}' of type '${args.addedInputFieldType}' was added to input object type '${args.inputName}'`;
}
export function inputFieldAddedFromMeta(args) {
    return {
        type: ChangeType.InputFieldAdded,
        criticality: args.meta.isAddedInputFieldTypeNullable
            ? {
                level: CriticalityLevel.Dangerous,
            }
            : {
                level: CriticalityLevel.Breaking,
                reason: 'Adding a required input field to an existing input object type is a breaking change because it will cause existing uses of this input object type to error.',
            },
        message: buildInputFieldAddedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.addedInputFieldName].join('.'),
    };
}
export function inputFieldAdded(input, field) {
    return inputFieldAddedFromMeta({
        type: ChangeType.InputFieldAdded,
        meta: {
            inputName: input.name,
            addedInputFieldName: field.name,
            isAddedInputFieldTypeNullable: !isNonNullType(field.type),
            addedInputFieldType: field.type.toString(),
        },
    });
}
function buildInputFieldDescriptionAddedMessage(args) {
    return `Input field '${args.inputName}.${args.inputFieldName}' has description '${args.addedInputFieldDescription}'`;
}
export function inputFieldDescriptionAddedFromMeta(args) {
    return {
        type: ChangeType.InputFieldDescriptionAdded,
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        message: buildInputFieldDescriptionAddedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.inputFieldName].join('.'),
    };
}
export function inputFieldDescriptionAdded(type, field) {
    return inputFieldDescriptionAddedFromMeta({
        type: ChangeType.InputFieldDescriptionAdded,
        meta: {
            inputName: type.name,
            inputFieldName: field.name,
            addedInputFieldDescription: field.description ?? '',
        },
    });
}
function buildInputFieldDescriptionRemovedMessage(args) {
    return `Description '${args.removedDescription}' was removed from input field '${args.inputName}.${args.inputFieldName}'`;
}
export function inputFieldDescriptionRemovedFromMeta(args) {
    return {
        type: ChangeType.InputFieldDescriptionRemoved,
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        message: buildInputFieldDescriptionRemovedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.inputFieldName].join('.'),
    };
}
export function inputFieldDescriptionRemoved(type, field) {
    return inputFieldDescriptionRemovedFromMeta({
        type: ChangeType.InputFieldDescriptionRemoved,
        meta: {
            inputName: type.name,
            inputFieldName: field.name,
            removedDescription: field.description ?? '',
        },
    });
}
function buildInputFieldDescriptionChangedMessage(args) {
    return `Input field '${args.inputName}.${args.inputFieldName}' description changed from '${args.oldInputFieldDescription}' to '${args.newInputFieldDescription}'`;
}
export function inputFieldDescriptionChangedFromMeta(args) {
    return {
        type: ChangeType.InputFieldDescriptionChanged,
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        message: buildInputFieldDescriptionChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.inputFieldName].join('.'),
    };
}
export function inputFieldDescriptionChanged(input, oldField, newField) {
    return inputFieldDescriptionChangedFromMeta({
        type: ChangeType.InputFieldDescriptionChanged,
        meta: {
            inputName: input.name,
            inputFieldName: oldField.name,
            oldInputFieldDescription: oldField.description ?? '',
            newInputFieldDescription: newField.description ?? '',
        },
    });
}
function buildInputFieldDefaultValueChangedMessage(args) {
    return `Input field '${args.inputName}.${args.inputFieldName}' default value changed from '${args.oldDefaultValue}' to '${args.newDefaultValue}'`;
}
export function inputFieldDefaultValueChangedFromMeta(args) {
    return {
        type: ChangeType.InputFieldDefaultValueChanged,
        criticality: {
            level: CriticalityLevel.Dangerous,
            reason: 'Changing the default value for an argument may change the runtime behavior of a field if it was never provided.',
        },
        message: buildInputFieldDefaultValueChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.inputFieldName].join('.'),
    };
}
export function inputFieldDefaultValueChanged(input, oldField, newField) {
    const meta = {
        inputName: input.name,
        inputFieldName: oldField.name,
    };
    if (oldField.defaultValue !== undefined) {
        meta.oldDefaultValue = safeString(oldField.defaultValue);
    }
    if (newField.defaultValue !== undefined) {
        meta.newDefaultValue = safeString(newField.defaultValue);
    }
    return inputFieldDefaultValueChangedFromMeta({
        type: ChangeType.InputFieldDefaultValueChanged,
        meta,
    });
}
function buildInputFieldTypeChangedMessage(args) {
    return `Input field '${args.inputName}.${args.inputFieldName}' changed type from '${args.oldInputFieldType}' to '${args.newInputFieldType}'`;
}
export function inputFieldTypeChangedFromMeta(args) {
    return {
        type: ChangeType.InputFieldTypeChanged,
        criticality: args.meta.isInputFieldTypeChangeSafe
            ? {
                level: CriticalityLevel.NonBreaking,
                reason: 'Changing an input field from non-null to null is considered non-breaking.',
            }
            : {
                level: CriticalityLevel.Breaking,
                reason: 'Changing the type of an input field can cause existing queries that use this field to error.',
            },
        message: buildInputFieldTypeChangedMessage(args.meta),
        meta: args.meta,
        path: [args.meta.inputName, args.meta.inputFieldName].join('.'),
    };
}
export function inputFieldTypeChanged(input, oldField, newField) {
    return inputFieldTypeChangedFromMeta({
        type: ChangeType.InputFieldTypeChanged,
        meta: {
            inputName: input.name,
            inputFieldName: oldField.name,
            oldInputFieldType: oldField.type.toString(),
            newInputFieldType: newField.type.toString(),
            isInputFieldTypeChangeSafe: safeChangeForInputValue(oldField.type, newField.type),
        },
    });
}
