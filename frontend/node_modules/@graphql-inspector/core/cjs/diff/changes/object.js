"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectTypeInterfaceRemoved = exports.objectTypeInterfaceRemovedFromMeta = exports.objectTypeInterfaceAdded = exports.objectTypeInterfaceAddedFromMeta = void 0;
const change_js_1 = require("./change.js");
function buildObjectTypeInterfaceAddedMessage(args) {
    return `'${args.objectTypeName}' object implements '${args.addedInterfaceName}' interface`;
}
function objectTypeInterfaceAddedFromMeta(args) {
    return {
        type: change_js_1.ChangeType.ObjectTypeInterfaceAdded,
        criticality: {
            level: change_js_1.CriticalityLevel.Dangerous,
            reason: 'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
        },
        message: buildObjectTypeInterfaceAddedMessage(args.meta),
        meta: args.meta,
        path: args.meta.objectTypeName,
    };
}
exports.objectTypeInterfaceAddedFromMeta = objectTypeInterfaceAddedFromMeta;
function objectTypeInterfaceAdded(iface, type) {
    return objectTypeInterfaceAddedFromMeta({
        type: change_js_1.ChangeType.ObjectTypeInterfaceAdded,
        meta: {
            objectTypeName: type.name,
            addedInterfaceName: iface.name,
        },
    });
}
exports.objectTypeInterfaceAdded = objectTypeInterfaceAdded;
function buildObjectTypeInterfaceRemovedMessage(args) {
    return `'${args.objectTypeName}' object type no longer implements '${args.removedInterfaceName}' interface`;
}
function objectTypeInterfaceRemovedFromMeta(args) {
    return {
        type: change_js_1.ChangeType.ObjectTypeInterfaceRemoved,
        criticality: {
            level: change_js_1.CriticalityLevel.Breaking,
            reason: 'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
        },
        message: buildObjectTypeInterfaceRemovedMessage(args.meta),
        meta: args.meta,
        path: args.meta.objectTypeName,
    };
}
exports.objectTypeInterfaceRemovedFromMeta = objectTypeInterfaceRemovedFromMeta;
function objectTypeInterfaceRemoved(iface, type) {
    return objectTypeInterfaceRemovedFromMeta({
        type: change_js_1.ChangeType.ObjectTypeInterfaceRemoved,
        meta: {
            objectTypeName: type.name,
            removedInterfaceName: iface.name,
        },
    });
}
exports.objectTypeInterfaceRemoved = objectTypeInterfaceRemoved;
