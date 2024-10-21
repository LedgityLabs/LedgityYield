import { ChangeType, CriticalityLevel, } from './change.js';
function buildObjectTypeInterfaceAddedMessage(args) {
    return `'${args.objectTypeName}' object implements '${args.addedInterfaceName}' interface`;
}
export function objectTypeInterfaceAddedFromMeta(args) {
    return {
        type: ChangeType.ObjectTypeInterfaceAdded,
        criticality: {
            level: CriticalityLevel.Dangerous,
            reason: 'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
        },
        message: buildObjectTypeInterfaceAddedMessage(args.meta),
        meta: args.meta,
        path: args.meta.objectTypeName,
    };
}
export function objectTypeInterfaceAdded(iface, type) {
    return objectTypeInterfaceAddedFromMeta({
        type: ChangeType.ObjectTypeInterfaceAdded,
        meta: {
            objectTypeName: type.name,
            addedInterfaceName: iface.name,
        },
    });
}
function buildObjectTypeInterfaceRemovedMessage(args) {
    return `'${args.objectTypeName}' object type no longer implements '${args.removedInterfaceName}' interface`;
}
export function objectTypeInterfaceRemovedFromMeta(args) {
    return {
        type: ChangeType.ObjectTypeInterfaceRemoved,
        criticality: {
            level: CriticalityLevel.Breaking,
            reason: 'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
        },
        message: buildObjectTypeInterfaceRemovedMessage(args.meta),
        meta: args.meta,
        path: args.meta.objectTypeName,
    };
}
export function objectTypeInterfaceRemoved(iface, type) {
    return objectTypeInterfaceRemovedFromMeta({
        type: ChangeType.ObjectTypeInterfaceRemoved,
        meta: {
            objectTypeName: type.name,
            removedInterfaceName: iface.name,
        },
    });
}
