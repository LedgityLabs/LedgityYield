"use strict";
/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/error/GraphQLError.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLError = void 0;
const graphql_1 = require("graphql");
function GraphQLError(message, locations, path, originalError, skipStackCapturing) {
    const extensions = originalError && originalError.extensions;
    Object.defineProperties(this, {
        message: {
            value: message,
            enumerable: true
        },
        locations: {
            value: locations || undefined,
            enumerable: locations && locations.length > 0
        },
        path: {
            value: path || undefined,
            enumerable: Boolean(path)
        },
        originalError: {
            value: originalError
        },
        extensions: {
            // Coercing falsey values to undefined ensures they will not be included
            // in JSON.stringify() when not provided.
            value: extensions || undefined,
            enumerable: Boolean(extensions)
        }
    });
    // Include (non-enumerable) stack trace.
    if (originalError && originalError.stack) {
        Object.defineProperty(this, "stack", {
            value: originalError.stack,
            writable: true,
            configurable: true
        });
    }
    else if (!skipStackCapturing) {
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GraphQLError);
        }
        else {
            Object.defineProperty(this, "stack", {
                value: Error().stack,
                writable: true,
                configurable: true
            });
        }
    }
}
exports.GraphQLError = GraphQLError;
GraphQLError.prototype = Object.create(graphql_1.GraphQLError.prototype, {
    constructor: { value: GraphQLError },
    name: { value: "GraphQLError" }
});
//# sourceMappingURL=error.js.map