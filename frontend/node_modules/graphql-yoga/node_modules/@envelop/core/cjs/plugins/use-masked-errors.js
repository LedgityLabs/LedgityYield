"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaskedErrors = exports.defaultMaskError = exports.createDefaultMaskError = exports.isOriginalGraphQLError = exports.isGraphQLError = exports.DEFAULT_ERROR_MESSAGE = void 0;
const utils_js_1 = require("../utils.js");
exports.DEFAULT_ERROR_MESSAGE = 'Unexpected error.';
function isGraphQLError(error) {
    return error instanceof Error && error.name === 'GraphQLError';
}
exports.isGraphQLError = isGraphQLError;
function isOriginalGraphQLError(error) {
    if (isGraphQLError(error)) {
        if (error.originalError != null) {
            return isOriginalGraphQLError(error.originalError);
        }
        return true;
    }
    return false;
}
exports.isOriginalGraphQLError = isOriginalGraphQLError;
function createSerializableGraphQLError(message, originalError, isDev) {
    const error = new Error(message);
    error.name = 'GraphQLError';
    if (isDev) {
        const extensions = originalError instanceof Error
            ? { message: originalError.message, stack: originalError.stack }
            : { message: String(originalError) };
        Object.defineProperty(error, 'extensions', {
            get() {
                return extensions;
            },
        });
    }
    Object.defineProperty(error, 'toJSON', {
        value() {
            return {
                message: error.message,
                extensions: error.extensions,
            };
        },
    });
    return error;
}
const createDefaultMaskError = (isDev) => (error, message) => {
    if (isOriginalGraphQLError(error)) {
        return error;
    }
    return createSerializableGraphQLError(message, error, isDev);
};
exports.createDefaultMaskError = createDefaultMaskError;
const isDev = globalThis.process?.env?.NODE_ENV === 'development';
exports.defaultMaskError = (0, exports.createDefaultMaskError)(isDev);
const makeHandleResult = (maskError, message) => ({ result, setResult, }) => {
    if (result.errors != null) {
        setResult({ ...result, errors: result.errors.map(error => maskError(error, message)) });
    }
};
function useMaskedErrors(opts) {
    const maskError = opts?.maskError ?? exports.defaultMaskError;
    const message = opts?.errorMessage || exports.DEFAULT_ERROR_MESSAGE;
    const handleResult = makeHandleResult(maskError, message);
    return {
        onPluginInit(context) {
            context.registerContextErrorHandler(({ error, setError }) => {
                setError(maskError(error, message));
            });
        },
        onExecute() {
            return {
                onExecuteDone(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
            };
        },
        onSubscribe() {
            return {
                onSubscribeResult(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
                onSubscribeError({ error, setError }) {
                    setError(maskError(error, message));
                },
            };
        },
    };
}
exports.useMaskedErrors = useMaskedErrors;
