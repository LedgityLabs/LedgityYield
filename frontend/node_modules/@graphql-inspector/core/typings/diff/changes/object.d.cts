import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import { Change, ChangeType, CriticalityLevel, ObjectTypeInterfaceAddedChange, ObjectTypeInterfaceRemovedChange } from './change.cjs';
export declare function objectTypeInterfaceAddedFromMeta(args: ObjectTypeInterfaceAddedChange): {
    readonly type: "OBJECT_TYPE_INTERFACE_ADDED";
    readonly criticality: {
        readonly level: CriticalityLevel.Dangerous;
        readonly reason: "Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.";
    };
    readonly message: string;
    readonly meta: {
        objectTypeName: string;
        addedInterfaceName: string;
    };
    readonly path: string;
};
export declare function objectTypeInterfaceAdded(iface: GraphQLInterfaceType, type: GraphQLObjectType): Change<typeof ChangeType.ObjectTypeInterfaceAdded>;
export declare function objectTypeInterfaceRemovedFromMeta(args: ObjectTypeInterfaceRemovedChange): {
    readonly type: "OBJECT_TYPE_INTERFACE_REMOVED";
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
        readonly reason: "Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.";
    };
    readonly message: string;
    readonly meta: {
        objectTypeName: string;
        removedInterfaceName: string;
    };
    readonly path: string;
};
export declare function objectTypeInterfaceRemoved(iface: GraphQLInterfaceType, type: GraphQLObjectType): Change<typeof ChangeType.ObjectTypeInterfaceRemoved>;
