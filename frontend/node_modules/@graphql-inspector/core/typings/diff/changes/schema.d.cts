import { GraphQLSchema } from 'graphql';
import { Change, ChangeType, CriticalityLevel, SchemaMutationTypeChangedChange, SchemaQueryTypeChangedChange, SchemaSubscriptionTypeChangedChange } from './change.cjs';
export declare function schemaQueryTypeChangedFromMeta(args: SchemaQueryTypeChangedChange): {
    readonly type: "SCHEMA_QUERY_TYPE_CHANGED";
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
    };
    readonly message: string;
    readonly meta: {
        oldQueryTypeName: string;
        newQueryTypeName: string;
    };
};
export declare function schemaQueryTypeChanged(oldSchema: GraphQLSchema, newSchema: GraphQLSchema): Change<typeof ChangeType.SchemaQueryTypeChanged>;
export declare function schemaMutationTypeChangedFromMeta(args: SchemaMutationTypeChangedChange): {
    readonly type: "SCHEMA_MUTATION_TYPE_CHANGED";
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
    };
    readonly message: string;
    readonly meta: {
        oldMutationTypeName: string;
        newMutationTypeName: string;
    };
};
export declare function schemaMutationTypeChanged(oldSchema: GraphQLSchema, newSchema: GraphQLSchema): Change<typeof ChangeType.SchemaMutationTypeChanged>;
export declare function schemaSubscriptionTypeChangedFromMeta(args: SchemaSubscriptionTypeChangedChange): {
    readonly type: "SCHEMA_SUBSCRIPTION_TYPE_CHANGED";
    readonly criticality: {
        readonly level: CriticalityLevel.Breaking;
    };
    readonly message: string;
    readonly meta: {
        oldSubscriptionTypeName: string;
        newSubscriptionTypeName: string;
    };
};
export declare function schemaSubscriptionTypeChanged(oldSchema: GraphQLSchema, newSchema: GraphQLSchema): Change<typeof ChangeType.SchemaSubscriptionTypeChanged>;
