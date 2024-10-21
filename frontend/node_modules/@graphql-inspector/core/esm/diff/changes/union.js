import { ChangeType, CriticalityLevel, } from './change.js';
function buildUnionMemberRemovedMessage(args) {
    return `Member '${args.removedUnionMemberTypeName}' was removed from Union type '${args.unionName}'`;
}
export function unionMemberRemovedFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: 'Removing a union member from a union can cause existing queries that use this union member in a fragment spread to error.',
        },
        type: ChangeType.UnionMemberRemoved,
        message: buildUnionMemberRemovedMessage(args.meta),
        meta: args.meta,
        path: args.meta.unionName,
    };
}
export function unionMemberRemoved(union, type) {
    return unionMemberRemovedFromMeta({
        type: ChangeType.UnionMemberRemoved,
        meta: {
            unionName: union.name,
            removedUnionMemberTypeName: type.name,
        },
    });
}
function buildUnionMemberAddedMessage(args) {
    return `Member '${args.addedUnionMemberTypeName}' was added to Union type '${args.unionName}'`;
}
export function buildUnionMemberAddedMessageFromMeta(args) {
    return {
        criticality: {
            level: CriticalityLevel.Dangerous,
            reason: 'Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.',
        },
        type: ChangeType.UnionMemberAdded,
        message: buildUnionMemberAddedMessage(args.meta),
        meta: args.meta,
        path: args.meta.unionName,
    };
}
export function unionMemberAdded(union, type) {
    return buildUnionMemberAddedMessageFromMeta({
        type: ChangeType.UnionMemberAdded,
        meta: {
            unionName: union.name,
            addedUnionMemberTypeName: type.name,
        },
    });
}
