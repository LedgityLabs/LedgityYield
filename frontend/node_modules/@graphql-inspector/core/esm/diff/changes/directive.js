import { isNonNullType } from 'graphql';
import { safeChangeForInputValue } from '../../utils/graphql.js';
import { safeString } from '../../utils/string.js';
import { ChangeType, CriticalityLevel, } from './change.js';
function buildDirectiveRemovedMessage(args) {
    return `Directive '${args.removedDirectiveName}' was removed`;
}
const directiveRemovedCriticalityBreakingReason = `A directive could be in use of a client application. Removing it could break the client application.`;
export function directiveRemovedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: directiveRemovedCriticalityBreakingReason,
        },
        type: ChangeType.DirectiveRemoved,
        message: buildDirectiveRemovedMessage(args.meta),
        path: `@${args.meta.removedDirectiveName}`,
        meta: args.meta,
    };
}
export function directiveRemoved(directive) {
    return directiveRemovedFromMeta({
        type: ChangeType.DirectiveRemoved,
        meta: {
            removedDirectiveName: directive.name,
        },
    });
}
function buildDirectiveAddedMessage(args) {
    return `Directive '${args.addedDirectiveName}' was added`;
}
export function directiveAddedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        type: ChangeType.DirectiveAdded,
        message: buildDirectiveAddedMessage(args.meta),
        path: `@${args.meta.addedDirectiveName}`,
        meta: args.meta,
    };
}
export function directiveAdded(directive) {
    return directiveAddedFromMeta({
        type: ChangeType.DirectiveAdded,
        meta: {
            addedDirectiveName: directive.name,
        },
    });
}
function buildDirectiveDescriptionChangedMessage(args) {
    return `Directive '${args.directiveName}' description changed from '${args.oldDirectiveDescription ?? 'undefined'}' to '${args.newDirectiveDescription ?? 'undefined'}'`;
}
export function directiveDescriptionChangedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        type: ChangeType.DirectiveDescriptionChanged,
        message: buildDirectiveDescriptionChangedMessage(args.meta),
        path: `@${args.meta.directiveName}`,
        meta: args.meta,
    };
}
export function directiveDescriptionChanged(oldDirective, newDirective) {
    return directiveDescriptionChangedFromMeta({
        type: ChangeType.DirectiveDescriptionChanged,
        meta: {
            directiveName: oldDirective.name,
            oldDirectiveDescription: oldDirective.description ?? null,
            newDirectiveDescription: newDirective.description ?? null,
        },
    });
}
function buildDirectiveLocationAddedMessage(args) {
    return `Location '${args.addedDirectiveLocation}' was added to directive '${args.directiveName}'`;
}
export function directiveLocationAddedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        type: ChangeType.DirectiveLocationAdded,
        message: buildDirectiveLocationAddedMessage(args.meta),
        path: `@${args.meta.directiveName}`,
        meta: args.meta,
    };
}
export function directiveLocationAdded(directive, location) {
    return directiveLocationAddedFromMeta({
        type: ChangeType.DirectiveLocationAdded,
        meta: {
            directiveName: directive.name,
            addedDirectiveLocation: location.toString(),
        },
    });
}
function buildDirectiveLocationRemovedMessage(args) {
    return `Location '${args.removedDirectiveLocation}' was removed from directive '${args.directiveName}'`;
}
const directiveLocationRemovedBreakingReason = `A directive could be in use of a client application. Removing it could break the client application.`;
export function directiveLocationRemovedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: directiveLocationRemovedBreakingReason,
        },
        type: ChangeType.DirectiveLocationRemoved,
        message: buildDirectiveLocationRemovedMessage(args.meta),
        path: `@${args.meta.directiveName}`,
        meta: args.meta,
    };
}
export function directiveLocationRemoved(directive, location) {
    return directiveLocationRemovedFromMeta({
        type: ChangeType.DirectiveLocationRemoved,
        meta: {
            directiveName: directive.name,
            removedDirectiveLocation: location.toString(),
        },
    });
}
const directiveArgumentAddedBreakingReason = `A directive could be in use of a client application. Adding a non-nullable argument will break those clients.`;
const directiveArgumentNonBreakingReason = `A directive could be in use of a client application. Adding a non-nullable argument will break those clients.`;
export function directiveArgumentAddedFromMeta(args) {
    return {
        criticality: args.meta.addedDirectiveArgumentTypeIsNonNull
            ? {
                level: CriticalityLevel.Breaking,
                reason: directiveArgumentAddedBreakingReason,
            }
            : {
                level: CriticalityLevel.NonBreaking,
                reason: directiveArgumentNonBreakingReason,
            },
        type: ChangeType.DirectiveArgumentAdded,
        message: `Argument '${args.meta.addedDirectiveArgumentName}' was added to directive '${args.meta.directiveName}'`,
        path: `@${args.meta.directiveName}`,
        meta: args.meta,
    };
}
export function directiveArgumentAdded(directive, arg) {
    return directiveArgumentAddedFromMeta({
        type: ChangeType.DirectiveArgumentAdded,
        meta: {
            directiveName: directive.name,
            addedDirectiveArgumentName: arg.name,
            addedDirectiveArgumentTypeIsNonNull: isNonNullType(arg.type),
        },
    });
}
function buildDirectiveArgumentRemovedMessage(args) {
    return `Argument '${args.removedDirectiveArgumentName}' was removed from directive '${args.directiveName}'`;
}
const directiveArgumentRemovedBreakingReason = `A directive argument could be in use of a client application. Removing the argument can break client applications.`;
export function directiveArgumentRemovedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: directiveArgumentRemovedBreakingReason,
        },
        type: ChangeType.DirectiveArgumentRemoved,
        message: buildDirectiveArgumentRemovedMessage(args.meta),
        path: `@${args.meta.directiveName}.${args.meta.removedDirectiveArgumentName}`,
        meta: args.meta,
    };
}
export function directiveArgumentRemoved(directive, arg) {
    return directiveArgumentRemovedFromMeta({
        type: ChangeType.DirectiveArgumentRemoved,
        meta: {
            directiveName: directive.name,
            removedDirectiveArgumentName: arg.name,
        },
    });
}
function buildDirectiveArgumentDescriptionChangedMessage(args) {
    return `Description for argument '${args.directiveArgumentName}' on directive '${args.directiveName}' changed from '${args.oldDirectiveArgumentDescription}' to '${args.newDirectiveArgumentDescription}'`;
}
export function directiveArgumentDescriptionChangedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.NonBreaking,
        },
        type: ChangeType.DirectiveArgumentDescriptionChanged,
        message: buildDirectiveArgumentDescriptionChangedMessage(args.meta),
        path: `@${args.meta.directiveName}.${args.meta.directiveArgumentName}`,
        meta: args.meta,
    };
}
export function directiveArgumentDescriptionChanged(directive, oldArg, newArg) {
    return directiveArgumentDescriptionChangedFromMeta({
        type: ChangeType.DirectiveArgumentDescriptionChanged,
        meta: {
            directiveName: directive.name,
            directiveArgumentName: oldArg.name,
            oldDirectiveArgumentDescription: oldArg.description ?? null,
            newDirectiveArgumentDescription: newArg.description ?? null,
        },
    });
}
function buildDirectiveArgumentDefaultValueChanged(args) {
    return args.oldDirectiveArgumentDefaultValue === undefined
        ? `Default value '${args.newDirectiveArgumentDefaultValue}' was added to argument '${args.directiveArgumentName}' on directive '${args.directiveName}'`
        : `Default value for argument '${args.directiveArgumentName}' on directive '${args.directiveName}' changed from '${args.oldDirectiveArgumentDefaultValue}' to '${args.newDirectiveArgumentDefaultValue}'`;
}
const directiveArgumentDefaultValueChangedDangerousReason = 'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.';
export function directiveArgumentDefaultValueChangedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Dangerous,
            reason: directiveArgumentDefaultValueChangedDangerousReason,
        },
        type: ChangeType.DirectiveArgumentDefaultValueChanged,
        message: buildDirectiveArgumentDefaultValueChanged(args.meta),
        path: `@${args.meta.directiveName}.${args.meta.directiveArgumentName}`,
        meta: args.meta,
    };
}
export function directiveArgumentDefaultValueChanged(directive, oldArg, newArg) {
    const meta = {
        directiveName: directive.name,
        directiveArgumentName: oldArg.name,
    };
    if (oldArg.defaultValue !== undefined) {
        meta.oldDirectiveArgumentDefaultValue = safeString(oldArg.defaultValue);
    }
    if (newArg.defaultValue !== undefined) {
        meta.newDirectiveArgumentDefaultValue = safeString(newArg.defaultValue);
    }
    return directiveArgumentDefaultValueChangedFromMeta({
        type: ChangeType.DirectiveArgumentDefaultValueChanged,
        meta,
    });
}
function buildDirectiveArgumentTypeChangedMessage(args) {
    return `Type for argument '${args.meta.directiveArgumentName}' on directive '${args.meta.directiveName}' changed from '${args.meta.oldDirectiveArgumentType}' to '${args.meta.newDirectiveArgumentType}'`;
}
const directiveArgumentTypeChangedNonBreakingReason = 'Changing an input field from non-null to null is considered non-breaking.';
export function directiveArgumentTypeChangedFromMeta(args) {
    return {
        criticality: args.meta.isSafeDirectiveArgumentTypeChange
            ? {
                level: CriticalityLevel.NonBreaking,
                reason: directiveArgumentTypeChangedNonBreakingReason,
            }
            : {
                level: CriticalityLevel.Breaking,
            },
        type: ChangeType.DirectiveArgumentTypeChanged,
        message: buildDirectiveArgumentTypeChangedMessage(args),
        path: `@${args.meta.directiveName}.${args.meta.directiveArgumentName}`,
        meta: args.meta,
    };
}
export function directiveArgumentTypeChanged(directive, oldArg, newArg) {
    return directiveArgumentTypeChangedFromMeta({
        type: ChangeType.DirectiveArgumentTypeChanged,
        meta: {
            directiveName: directive.name,
            directiveArgumentName: oldArg.name,
            oldDirectiveArgumentType: oldArg.type.toString(),
            newDirectiveArgumentType: newArg.type.toString(),
            isSafeDirectiveArgumentTypeChange: safeChangeForInputValue(oldArg.type, newArg.type),
        },
    });
}
