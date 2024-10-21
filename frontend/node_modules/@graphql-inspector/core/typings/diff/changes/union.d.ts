import { GraphQLObjectType, GraphQLUnionType } from 'graphql';
import { Change, ChangeType, CriticalityLevel, UnionMemberAddedChange, UnionMemberRemovedChange } from './change.js';
export declare function unionMemberRemovedFromMeta(args: UnionMemberRemovedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
        readonly reason: "Removing a union member from a union can cause existing queries that use this union member in a fragment spread to error.";
    };
    readonly type: "UNION_MEMBER_REMOVED";
    readonly message: string;
    readonly meta: {
        unionName: string;
        removedUnionMemberTypeName: string;
    };
    readonly path: string;
};
export declare function unionMemberRemoved(union: GraphQLUnionType, type: GraphQLObjectType): Change<typeof ChangeType.UnionMemberRemoved>;
export declare function buildUnionMemberAddedMessageFromMeta(args: UnionMemberAddedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.Dangerous;
        readonly reason: "Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.";
    };
    readonly type: "UNION_MEMBER_ADDED";
    readonly message: string;
    readonly meta: {
        unionName: string;
        addedUnionMemberTypeName: string;
    };
    readonly path: string;
};
export declare function unionMemberAdded(union: GraphQLUnionType, type: GraphQLObjectType): Change<typeof ChangeType.UnionMemberAdded>;
