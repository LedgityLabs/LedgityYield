"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskError = void 0;
const utils_1 = require("@graphql-tools/utils");
const error_js_1 = require("../error.js");
const maskError = (error, message, isDev = globalThis.process?.env?.NODE_ENV === 'development') => {
    if ((0, error_js_1.isGraphQLError)(error)) {
        if (error.originalError) {
            if (error.originalError.name === 'GraphQLError') {
                return error;
            }
            // Original error should be removed
            const extensions = {
                ...error.extensions,
                unexpected: true,
            };
            if (isDev) {
                extensions.originalError = {
                    message: error.originalError.message,
                    stack: error.originalError.stack,
                };
            }
            return (0, utils_1.createGraphQLError)(message, {
                nodes: error.nodes,
                source: error.source,
                positions: error.positions,
                path: error.path,
                extensions,
            });
        }
        return error;
    }
    return (0, utils_1.createGraphQLError)(message, {
        extensions: {
            unexpected: true,
            originalError: isDev
                ? error instanceof Error
                    ? {
                        message: error.message,
                        stack: error.stack,
                    }
                    : error
                : undefined,
        },
    });
};
exports.maskError = maskError;
