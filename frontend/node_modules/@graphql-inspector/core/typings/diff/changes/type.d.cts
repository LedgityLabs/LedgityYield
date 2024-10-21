import { GraphQLNamedType } from 'graphql';
import { Change, ChangeType, CriticalityLevel, TypeAddedChange, TypeDescriptionAddedChange, TypeDescriptionChangedChange, TypeDescriptionRemovedChange, TypeKindChangedChange, TypeRemovedChange } from './change.cjs';
export declare function typeRemovedFromMeta(args: TypeRemovedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
    };
    readonly type: "TYPE_REMOVED";
    readonly message: string;
    readonly meta: {
        removedTypeName: string;
    };
    readonly path: string;
};
export declare function typeRemoved(type: GraphQLNamedType): Change<typeof ChangeType.TypeRemoved>;
export declare function typeAddedFromMeta(args: TypeAddedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "TYPE_ADDED";
    readonly message: string;
    readonly meta: {
        addedTypeName: string;
    };
    readonly path: string;
};
export declare function typeAdded(type: GraphQLNamedType): Change<typeof ChangeType.TypeAdded>;
export declare function typeKindChangedFromMeta(args: TypeKindChangedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
        readonly reason: "Changing the kind of a type is a breaking change because it can cause existing queries to error. For example, turning an object type to a scalar type would break queries that define a selection set for this type.";
    };
    readonly type: "TYPE_KIND_CHANGED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        typeName: string;
        oldTypeKind: string;
        newTypeKind: string;
    };
};
export declare function typeKindChanged(oldType: GraphQLNamedType, newType: GraphQLNamedType): Change<typeof ChangeType.TypeKindChanged>;
export declare function typeDescriptionChangedFromMeta(args: TypeDescriptionChangedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "TYPE_DESCRIPTION_CHANGED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        typeName: string;
        oldTypeDescription: string;
        newTypeDescription: string;
    };
};
export declare function typeDescriptionChanged(oldType: GraphQLNamedType, newType: GraphQLNamedType): Change<typeof ChangeType.TypeDescriptionChanged>;
export declare function typeDescriptionRemovedFromMeta(args: TypeDescriptionRemovedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "TYPE_DESCRIPTION_REMOVED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        typeName: string;
        removedTypeDescription: string;
    };
};
export declare function typeDescriptionRemoved(type: GraphQLNamedType): Change<typeof ChangeType.TypeDescriptionRemoved>;
export declare function typeDescriptionAddedFromMeta(args: TypeDescriptionAddedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "TYPE_DESCRIPTION_ADDED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        typeName: string;
        addedTypeDescription: string;
    };
};
export declare function typeDescriptionAdded(type: GraphQLNamedType): Change<typeof ChangeType.TypeDescriptionAdded>;
