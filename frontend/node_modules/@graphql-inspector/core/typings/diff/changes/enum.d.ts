import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
import { Change, ChangeType, CriticalityLevel, EnumValueAddedChange, EnumValueDeprecationReasonAddedChange, EnumValueDeprecationReasonChangedChange, EnumValueDeprecationReasonRemovedChange, EnumValueDescriptionChangedChange, EnumValueRemovedChange } from './change.js';
export declare function enumValueRemovedFromMeta(args: EnumValueRemovedChange): {
    readonly type: "ENUM_VALUE_REMOVED";
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
        readonly reason: "Removing an enum value will cause existing queries that use this enum value to error.";
    };
    readonly message: string;
    readonly meta: {
        enumName: string;
        removedEnumValueName: string;
        isEnumValueDeprecated: boolean;
    };
    readonly path: string;
};
export declare function enumValueRemoved(oldEnum: GraphQLEnumType, value: GraphQLEnumValue): Change<typeof ChangeType.EnumValueRemoved>;
export declare function enumValueAddedFromMeta(args: EnumValueAddedChange): {
    readonly type: "ENUM_VALUE_ADDED";
    readonly criticality: {
        readonly level: CriticalityLevel.Dangerous;
        readonly reason: "Adding an enum value may break existing clients that were not programming defensively against an added case when querying an enum.";
    };
    readonly message: string;
    readonly meta: {
        enumName: string;
        addedEnumValueName: string;
    };
    readonly path: string;
};
export declare function enumValueAdded(newEnum: GraphQLEnumType, value: GraphQLEnumValue): Change<typeof ChangeType.EnumValueAdded>;
export declare function enumValueDescriptionChangedFromMeta(args: EnumValueDescriptionChangedChange): Change<typeof ChangeType.EnumValueDescriptionChanged>;
export declare function enumValueDescriptionChanged(newEnum: GraphQLEnumType, oldValue: GraphQLEnumValue, newValue: GraphQLEnumValue): Change<typeof ChangeType.EnumValueDescriptionChanged>;
export declare function enumValueDeprecationReasonChangedFromMeta(args: EnumValueDeprecationReasonChangedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "ENUM_VALUE_DEPRECATION_REASON_CHANGED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        enumName: string;
        enumValueName: string;
        oldEnumValueDeprecationReason: string;
        newEnumValueDeprecationReason: string;
    };
};
export declare function enumValueDeprecationReasonChanged(newEnum: GraphQLEnumType, oldValue: GraphQLEnumValue, newValue: GraphQLEnumValue): Change<typeof ChangeType.EnumValueDeprecationReasonChanged>;
export declare function enumValueDeprecationReasonAddedFromMeta(args: EnumValueDeprecationReasonAddedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "ENUM_VALUE_DEPRECATION_REASON_ADDED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        enumName: string;
        enumValueName: string;
        addedValueDeprecationReason: string;
    };
};
export declare function enumValueDeprecationReasonAdded(newEnum: GraphQLEnumType, oldValue: GraphQLEnumValue, newValue: GraphQLEnumValue): Change<typeof ChangeType.EnumValueDeprecationReasonAdded>;
export declare function enumValueDeprecationReasonRemovedFromMeta(args: EnumValueDeprecationReasonRemovedChange): {
    readonly criticality: {
        readonly level: CriticalityLevel.NonBreaking;
    };
    readonly type: "ENUM_VALUE_DEPRECATION_REASON_REMOVED";
    readonly message: string;
    readonly path: string;
    readonly meta: {
        enumName: string;
        enumValueName: string;
        removedEnumValueDeprecationReason: string;
    };
};
export declare function enumValueDeprecationReasonRemoved(newEnum: GraphQLEnumType, oldValue: GraphQLEnumValue, _newValue: GraphQLEnumValue): Change<typeof ChangeType.EnumValueDeprecationReasonRemoved>;
