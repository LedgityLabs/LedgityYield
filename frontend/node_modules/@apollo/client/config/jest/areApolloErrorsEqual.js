function isApolloError(e) {
    return e instanceof Error && e.name == "ApolloError";
}
export var areApolloErrorsEqual = function (a, b, customTesters) {
    var isAApolloError = isApolloError(a);
    var isBApolloError = isApolloError(b);
    if (isAApolloError && isBApolloError) {
        return (a.message === b.message &&
            this.equals(a.graphQLErrors, b.graphQLErrors, customTesters) &&
            this.equals(a.protocolErrors, b.protocolErrors, customTesters) &&
            this.equals(a.clientErrors, b.clientErrors, customTesters) &&
            this.equals(a.networkError, b.networkError, customTesters) &&
            this.equals(a.cause, b.cause, customTesters) &&
            this.equals(a.extraInfo, b.extraInfo, customTesters));
    }
    else if (isAApolloError === isBApolloError) {
        return undefined;
    }
    else {
        return false;
    }
};
//# sourceMappingURL=areApolloErrorsEqual.js.map