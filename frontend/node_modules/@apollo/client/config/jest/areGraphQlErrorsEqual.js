import { GraphQLError } from "graphql";
export var areGraphQLErrorsEqual = function (a, b, customTesters) {
    if (a instanceof GraphQLError || b instanceof GraphQLError) {
        return this.equals(a instanceof GraphQLError ? a.toJSON() : a, b instanceof GraphQLError ? b.toJSON() : b, customTesters);
    }
};
//# sourceMappingURL=areGraphQlErrorsEqual.js.map