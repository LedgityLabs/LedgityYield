"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMutationViaGet = assertMutationViaGet;
exports.usePreventMutationViaGET = usePreventMutationViaGET;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
function assertMutationViaGet(method, document, operationName) {
    const operation = document
        ? (0, graphql_1.getOperationAST)(document, operationName) ?? undefined
        : undefined;
    if (!operation) {
        throw (0, utils_1.createGraphQLError)('Could not determine what operation to execute.', {
            extensions: {
                http: {
                    status: 400,
                },
            },
        });
    }
    if (operation.operation === 'mutation' && method === 'GET') {
        throw (0, utils_1.createGraphQLError)('Can only perform a mutation operation from a POST request.', {
            extensions: {
                http: {
                    status: 405,
                    headers: {
                        Allow: 'POST',
                    },
                },
            },
        });
    }
}
function usePreventMutationViaGET() {
    return {
        onParse() {
            // We should improve this by getting Yoga stuff from the hook params directly instead of the context
            return ({ result, context: { request, 
            // the `params` might be missing in cases where the user provided
            // malformed context to getEnveloped (like `yoga.getEnveloped({})`)
            params: { operationName } = {}, }, }) => {
                // Run only if this is a Yoga request
                // the `request` might be missing when using graphql-ws for example
                // in which case throwing an error would abruptly close the socket
                if (!request) {
                    return;
                }
                if (result instanceof Error) {
                    if (result instanceof graphql_1.GraphQLError) {
                        result.extensions.http = {
                            spec: true,
                            status: 400,
                        };
                    }
                    throw result;
                }
                assertMutationViaGet(request.method, result, operationName);
            };
        },
    };
}
