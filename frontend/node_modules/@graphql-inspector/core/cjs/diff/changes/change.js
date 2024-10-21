"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeType = exports.CriticalityLevel = void 0;
var CriticalityLevel;
(function (CriticalityLevel) {
    CriticalityLevel["Breaking"] = "BREAKING";
    CriticalityLevel["NonBreaking"] = "NON_BREAKING";
    CriticalityLevel["Dangerous"] = "DANGEROUS";
})(CriticalityLevel || (exports.CriticalityLevel = CriticalityLevel = {}));
exports.ChangeType = {
    // Argument
    FieldArgumentDescriptionChanged: 'FIELD_ARGUMENT_DESCRIPTION_CHANGED',
    FieldArgumentDefaultChanged: 'FIELD_ARGUMENT_DEFAULT_CHANGED',
    FieldArgumentTypeChanged: 'FIELD_ARGUMENT_TYPE_CHANGED',
    // Directive
    DirectiveRemoved: 'DIRECTIVE_REMOVED',
    DirectiveAdded: 'DIRECTIVE_ADDED',
    DirectiveDescriptionChanged: 'DIRECTIVE_DESCRIPTION_CHANGED',
    DirectiveLocationAdded: 'DIRECTIVE_LOCATION_ADDED',
    DirectiveLocationRemoved: 'DIRECTIVE_LOCATION_REMOVED',
    DirectiveArgumentAdded: 'DIRECTIVE_ARGUMENT_ADDED',
    DirectiveArgumentRemoved: 'DIRECTIVE_ARGUMENT_REMOVED',
    DirectiveArgumentDescriptionChanged: 'DIRECTIVE_ARGUMENT_DESCRIPTION_CHANGED',
    DirectiveArgumentDefaultValueChanged: 'DIRECTIVE_ARGUMENT_DEFAULT_VALUE_CHANGED',
    DirectiveArgumentTypeChanged: 'DIRECTIVE_ARGUMENT_TYPE_CHANGED',
    // Enum
    EnumValueRemoved: 'ENUM_VALUE_REMOVED',
    EnumValueAdded: 'ENUM_VALUE_ADDED',
    EnumValueDescriptionChanged: 'ENUM_VALUE_DESCRIPTION_CHANGED',
    EnumValueDeprecationReasonChanged: 'ENUM_VALUE_DEPRECATION_REASON_CHANGED',
    EnumValueDeprecationReasonAdded: 'ENUM_VALUE_DEPRECATION_REASON_ADDED',
    EnumValueDeprecationReasonRemoved: 'ENUM_VALUE_DEPRECATION_REASON_REMOVED',
    // Field
    FieldRemoved: 'FIELD_REMOVED',
    FieldAdded: 'FIELD_ADDED',
    FieldDescriptionChanged: 'FIELD_DESCRIPTION_CHANGED',
    FieldDescriptionAdded: 'FIELD_DESCRIPTION_ADDED',
    FieldDescriptionRemoved: 'FIELD_DESCRIPTION_REMOVED',
    FieldDeprecationAdded: 'FIELD_DEPRECATION_ADDED',
    FieldDeprecationRemoved: 'FIELD_DEPRECATION_REMOVED',
    FieldDeprecationReasonChanged: 'FIELD_DEPRECATION_REASON_CHANGED',
    FieldDeprecationReasonAdded: 'FIELD_DEPRECATION_REASON_ADDED',
    FieldDeprecationReasonRemoved: 'FIELD_DEPRECATION_REASON_REMOVED',
    FieldTypeChanged: 'FIELD_TYPE_CHANGED',
    FieldArgumentAdded: 'FIELD_ARGUMENT_ADDED',
    FieldArgumentRemoved: 'FIELD_ARGUMENT_REMOVED',
    // Input
    InputFieldRemoved: 'INPUT_FIELD_REMOVED',
    InputFieldAdded: 'INPUT_FIELD_ADDED',
    InputFieldDescriptionAdded: 'INPUT_FIELD_DESCRIPTION_ADDED',
    InputFieldDescriptionRemoved: 'INPUT_FIELD_DESCRIPTION_REMOVED',
    InputFieldDescriptionChanged: 'INPUT_FIELD_DESCRIPTION_CHANGED',
    InputFieldDefaultValueChanged: 'INPUT_FIELD_DEFAULT_VALUE_CHANGED',
    InputFieldTypeChanged: 'INPUT_FIELD_TYPE_CHANGED',
    // Type
    ObjectTypeInterfaceAdded: 'OBJECT_TYPE_INTERFACE_ADDED',
    ObjectTypeInterfaceRemoved: 'OBJECT_TYPE_INTERFACE_REMOVED',
    // Schema
    SchemaQueryTypeChanged: 'SCHEMA_QUERY_TYPE_CHANGED',
    SchemaMutationTypeChanged: 'SCHEMA_MUTATION_TYPE_CHANGED',
    SchemaSubscriptionTypeChanged: 'SCHEMA_SUBSCRIPTION_TYPE_CHANGED',
    // Type
    TypeRemoved: 'TYPE_REMOVED',
    TypeAdded: 'TYPE_ADDED',
    TypeKindChanged: 'TYPE_KIND_CHANGED',
    TypeDescriptionChanged: 'TYPE_DESCRIPTION_CHANGED',
    // TODO
    TypeDescriptionRemoved: 'TYPE_DESCRIPTION_REMOVED',
    // TODO
    TypeDescriptionAdded: 'TYPE_DESCRIPTION_ADDED',
    // Union
    UnionMemberRemoved: 'UNION_MEMBER_REMOVED',
    UnionMemberAdded: 'UNION_MEMBER_ADDED',
    // Directive Usage
    DirectiveUsageUnionMemberAdded: 'DIRECTIVE_USAGE_UNION_MEMBER_ADDED',
    DirectiveUsageUnionMemberRemoved: 'DIRECTIVE_USAGE_UNION_MEMBER_REMOVED',
    DirectiveUsageEnumAdded: 'DIRECTIVE_USAGE_ENUM_ADDED',
    DirectiveUsageEnumRemoved: 'DIRECTIVE_USAGE_ENUM_REMOVED',
    DirectiveUsageEnumValueAdded: 'DIRECTIVE_USAGE_ENUM_VALUE_ADDED',
    DirectiveUsageEnumValueRemoved: 'DIRECTIVE_USAGE_ENUM_VALUE_REMOVED',
    DirectiveUsageInputObjectAdded: 'DIRECTIVE_USAGE_INPUT_OBJECT_ADDED',
    DirectiveUsageInputObjectRemoved: 'DIRECTIVE_USAGE_INPUT_OBJECT_REMOVED',
    DirectiveUsageFieldAdded: 'DIRECTIVE_USAGE_FIELD_ADDED',
    DirectiveUsageFieldRemoved: 'DIRECTIVE_USAGE_FIELD_REMOVED',
    DirectiveUsageScalarAdded: 'DIRECTIVE_USAGE_SCALAR_ADDED',
    DirectiveUsageScalarRemoved: 'DIRECTIVE_USAGE_SCALAR_REMOVED',
    DirectiveUsageObjectAdded: 'DIRECTIVE_USAGE_OBJECT_ADDED',
    DirectiveUsageObjectRemoved: 'DIRECTIVE_USAGE_OBJECT_REMOVED',
    DirectiveUsageInterfaceAdded: 'DIRECTIVE_USAGE_INTERFACE_ADDED',
    DirectiveUsageInterfaceRemoved: 'DIRECTIVE_USAGE_INTERFACE_REMOVED',
    DirectiveUsageArgumentDefinitionAdded: 'DIRECTIVE_USAGE_ARGUMENT_DEFINITION_ADDED',
    DirectiveUsageArgumentDefinitionRemoved: 'DIRECTIVE_USAGE_ARGUMENT_DEFINITION_REMOVED',
    DirectiveUsageSchemaAdded: 'DIRECTIVE_USAGE_SCHEMA_ADDED',
    DirectiveUsageSchemaRemoved: 'DIRECTIVE_USAGE_SCHEMA_REMOVED',
    DirectiveUsageFieldDefinitionAdded: 'DIRECTIVE_USAGE_FIELD_DEFINITION_ADDED',
    DirectiveUsageFieldDefinitionRemoved: 'DIRECTIVE_USAGE_FIELD_DEFINITION_REMOVED',
    DirectiveUsageInputFieldDefinitionAdded: 'DIRECTIVE_USAGE_INPUT_FIELD_DEFINITION_ADDED',
    DirectiveUsageInputFieldDefinitionRemoved: 'DIRECTIVE_USAGE_INPUT_FIELD_DEFINITION_REMOVED',
};
