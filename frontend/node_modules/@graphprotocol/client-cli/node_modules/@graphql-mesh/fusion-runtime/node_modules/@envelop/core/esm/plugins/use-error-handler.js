import { handleStreamOrSingleExecutionResult } from '../utils.js';
import { isGraphQLError } from './use-masked-errors.js';
const makeHandleResult = (errorHandler) => ({ result, args }) => {
    if (result.errors?.length) {
        errorHandler({ errors: result.errors, context: args, phase: 'execution' });
    }
};
export const useErrorHandler = (errorHandler) => {
    const handleResult = makeHandleResult(errorHandler);
    return {
        onParse() {
            return function onParseEnd({ result, context }) {
                if (result instanceof Error) {
                    errorHandler({ errors: [result], context, phase: 'parse' });
                }
            };
        },
        onValidate() {
            return function onValidateEnd({ valid, result, context }) {
                if (valid === false && result.length > 0) {
                    errorHandler({ errors: result, context, phase: 'validate' });
                }
            };
        },
        onPluginInit(context) {
            context.registerContextErrorHandler(({ error }) => {
                if (isGraphQLError(error)) {
                    errorHandler({ errors: [error], context, phase: 'context' });
                }
                else {
                    // @ts-expect-error its not an error at this point so we just create a new one - can we handle this better?
                    errorHandler({ errors: [new Error(error)], context, phase: 'context' });
                }
            });
        },
        onExecute() {
            return {
                onExecuteDone(payload) {
                    return handleStreamOrSingleExecutionResult(payload, handleResult);
                },
            };
        },
        onSubscribe() {
            return {
                onSubscribeResult(payload) {
                    return handleStreamOrSingleExecutionResult(payload, handleResult);
                },
            };
        },
    };
};
