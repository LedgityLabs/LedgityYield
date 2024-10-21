"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvelopOrchestrator = void 0;
const document_string_map_js_1 = require("./document-string-map.js");
const utils_js_1 = require("./utils.js");
function throwEngineFunctionError(name) {
    throw Error(`No \`${name}\` function found! Register it using "useEngine" plugin.`);
}
function createEnvelopOrchestrator({ plugins, }) {
    let schema = null;
    let initDone = false;
    const parse = () => throwEngineFunctionError('parse');
    const validate = () => throwEngineFunctionError('validate');
    const execute = () => throwEngineFunctionError('execute');
    const subscribe = () => throwEngineFunctionError('subscribe');
    // Define the initial method for replacing the GraphQL schema, this is needed in order
    // to allow setting the schema from the onPluginInit callback. We also need to make sure
    // here not to call the same plugin that initiated the schema switch.
    const replaceSchema = (newSchema, ignorePluginIndex = -1) => {
        schema = newSchema;
        if (initDone) {
            for (const [i, plugin] of plugins.entries()) {
                if (i !== ignorePluginIndex) {
                    plugin.onSchemaChange &&
                        plugin.onSchemaChange({
                            schema,
                            replaceSchema: schemaToSet => {
                                replaceSchema(schemaToSet, i);
                            },
                        });
                }
            }
        }
    };
    const contextErrorHandlers = [];
    // Iterate all plugins and trigger onPluginInit
    for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        const pluginsToAdd = [];
        plugin.onPluginInit &&
            plugin.onPluginInit({
                plugins,
                addPlugin: newPlugin => {
                    pluginsToAdd.push(newPlugin);
                },
                setSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
                registerContextErrorHandler: handler => contextErrorHandlers.push(handler),
            });
        pluginsToAdd.length && plugins.splice(i + 1, 0, ...pluginsToAdd);
    }
    // A set of before callbacks defined here in order to allow it to be used later
    const beforeCallbacks = {
        init: [],
        parse: [],
        validate: [],
        subscribe: [],
        execute: [],
        context: [],
    };
    for (const { onContextBuilding, onExecute, onParse, onSubscribe, onValidate, onEnveloped, } of plugins) {
        onEnveloped && beforeCallbacks.init.push(onEnveloped);
        onContextBuilding && beforeCallbacks.context.push(onContextBuilding);
        onExecute && beforeCallbacks.execute.push(onExecute);
        onParse && beforeCallbacks.parse.push(onParse);
        onSubscribe && beforeCallbacks.subscribe.push(onSubscribe);
        onValidate && beforeCallbacks.validate.push(onValidate);
    }
    const init = initialContext => {
        for (const [i, onEnveloped] of beforeCallbacks.init.entries()) {
            onEnveloped({
                context: initialContext,
                extendContext: extension => {
                    if (!initialContext) {
                        return;
                    }
                    Object.assign(initialContext, extension);
                },
                setSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
            });
        }
    };
    const customParse = beforeCallbacks.parse.length
        ? initialContext => (source, parseOptions) => {
            let result = null;
            let parseFn = parse;
            const context = initialContext;
            const afterCalls = [];
            for (const onParse of beforeCallbacks.parse) {
                const afterFn = onParse({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    params: { source, options: parseOptions },
                    parseFn,
                    setParseFn: newFn => {
                        parseFn = newFn;
                    },
                    setParsedDocument: newDoc => {
                        result = newDoc;
                    },
                });
                afterFn && afterCalls.push(afterFn);
            }
            if (result === null) {
                try {
                    result = parseFn(source, parseOptions);
                }
                catch (e) {
                    result = e;
                }
            }
            for (const afterCb of afterCalls) {
                afterCb({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    replaceParseResult: newResult => {
                        result = newResult;
                    },
                    result,
                });
            }
            if (result === null) {
                throw new Error(`Failed to parse document.`);
            }
            if (result instanceof Error) {
                throw result;
            }
            document_string_map_js_1.documentStringMap.set(result, source.toString());
            return result;
        }
        : () => parse;
    const customValidate = beforeCallbacks.validate
        .length
        ? initialContext => (schema, documentAST, rules, typeInfo, validationOptions) => {
            let actualRules = rules ? [...rules] : undefined;
            let validateFn = validate;
            let result = null;
            const context = initialContext;
            const afterCalls = [];
            for (const onValidate of beforeCallbacks.validate) {
                const afterFn = onValidate({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    params: {
                        schema,
                        documentAST,
                        rules: actualRules,
                        typeInfo,
                        options: validationOptions,
                    },
                    validateFn,
                    addValidationRule: rule => {
                        if (!actualRules) {
                            actualRules = [];
                        }
                        actualRules.push(rule);
                    },
                    setValidationFn: newFn => {
                        validateFn = newFn;
                    },
                    setResult: newResults => {
                        result = newResults;
                    },
                });
                afterFn && afterCalls.push(afterFn);
            }
            if (!result) {
                result = validateFn(schema, documentAST, actualRules, typeInfo, validationOptions);
            }
            if (!result) {
                return;
            }
            const valid = result.length === 0;
            for (const afterCb of afterCalls) {
                afterCb({
                    valid,
                    result,
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    setResult: newResult => {
                        result = newResult;
                    },
                });
            }
            return result;
        }
        : () => validate;
    const customContextFactory = beforeCallbacks.context.length
        ? initialContext => async (orchestratorCtx) => {
            const afterCalls = [];
            // In order to have access to the "last working" context object we keep this outside of the try block:
            const context = initialContext;
            if (orchestratorCtx) {
                Object.assign(context, orchestratorCtx);
            }
            try {
                let isBreakingContextBuilding = false;
                for (const onContext of beforeCallbacks.context) {
                    const afterHookResult = await onContext({
                        context,
                        extendContext: extension => {
                            Object.assign(context, extension);
                        },
                        breakContextBuilding: () => {
                            isBreakingContextBuilding = true;
                        },
                    });
                    if (typeof afterHookResult === 'function') {
                        afterCalls.push(afterHookResult);
                    }
                    if (isBreakingContextBuilding === true) {
                        break;
                    }
                }
                for (const afterCb of afterCalls) {
                    afterCb({
                        context,
                        extendContext: extension => {
                            Object.assign(context, extension);
                        },
                    });
                }
                return context;
            }
            catch (err) {
                let error = err;
                for (const errorCb of contextErrorHandlers) {
                    errorCb({
                        context,
                        error,
                        setError: err => {
                            error = err;
                        },
                    });
                }
                throw error;
            }
        }
        : initialContext => orchestratorCtx => {
            if (orchestratorCtx) {
                Object.assign(initialContext, orchestratorCtx);
            }
            return initialContext;
        };
    const useCustomSubscribe = beforeCallbacks.subscribe.length;
    const customSubscribe = useCustomSubscribe
        ? (0, utils_js_1.makeSubscribe)(async (args) => {
            let subscribeFn = subscribe;
            const afterCalls = [];
            const subscribeErrorHandlers = [];
            const context = args.contextValue || {};
            let result;
            for (const onSubscribe of beforeCallbacks.subscribe) {
                const after = await onSubscribe({
                    subscribeFn,
                    setSubscribeFn: newSubscribeFn => {
                        subscribeFn = newSubscribeFn;
                    },
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    args: args,
                    setResultAndStopExecution: stopResult => {
                        result = stopResult;
                    },
                });
                if (after) {
                    if (after.onSubscribeResult) {
                        afterCalls.push(after.onSubscribeResult);
                    }
                    if (after.onSubscribeError) {
                        subscribeErrorHandlers.push(after.onSubscribeError);
                    }
                }
                if (result !== undefined) {
                    break;
                }
            }
            if (result === undefined) {
                result = await subscribeFn({
                    ...args,
                    contextValue: context,
                    // Casted for GraphQL.js 15 compatibility
                    // Can be removed once we drop support for GraphQL.js 15
                });
            }
            if (!result) {
                return;
            }
            const onNextHandler = [];
            const onEndHandler = [];
            for (const afterCb of afterCalls) {
                const hookResult = afterCb({
                    args: args,
                    result,
                    setResult: newResult => {
                        result = newResult;
                    },
                });
                if (hookResult) {
                    if (hookResult.onNext) {
                        onNextHandler.push(hookResult.onNext);
                    }
                    if (hookResult.onEnd) {
                        onEndHandler.push(hookResult.onEnd);
                    }
                }
            }
            if (onNextHandler.length && (0, utils_js_1.isAsyncIterable)(result)) {
                result = (0, utils_js_1.mapAsyncIterator)(result, async (result) => {
                    for (const onNext of onNextHandler) {
                        await onNext({
                            args: args,
                            result,
                            setResult: newResult => (result = newResult),
                        });
                    }
                    return result;
                });
            }
            if (onEndHandler.length && (0, utils_js_1.isAsyncIterable)(result)) {
                result = (0, utils_js_1.finalAsyncIterator)(result, () => {
                    for (const onEnd of onEndHandler) {
                        onEnd();
                    }
                });
            }
            if (subscribeErrorHandlers.length && (0, utils_js_1.isAsyncIterable)(result)) {
                result = (0, utils_js_1.errorAsyncIterator)(result, err => {
                    let error = err;
                    for (const handler of subscribeErrorHandlers) {
                        handler({
                            error,
                            setError: err => {
                                error = err;
                            },
                        });
                    }
                    throw error;
                });
            }
            return result;
        })
        : (0, utils_js_1.makeSubscribe)(subscribe);
    const useCustomExecute = beforeCallbacks.execute.length;
    const customExecute = useCustomExecute
        ? (0, utils_js_1.makeExecute)(async (args) => {
            let executeFn = execute;
            let result;
            const afterCalls = [];
            const context = args.contextValue || {};
            for (const onExecute of beforeCallbacks.execute) {
                const after = await onExecute({
                    executeFn,
                    setExecuteFn: newExecuteFn => {
                        executeFn = newExecuteFn;
                    },
                    setResultAndStopExecution: stopResult => {
                        result = stopResult;
                    },
                    extendContext: extension => {
                        if (typeof extension === 'object') {
                            Object.assign(context, extension);
                        }
                        else {
                            throw new Error(`Invalid context extension provided! Expected "object", got: "${JSON.stringify(extension)}" (${typeof extension})`);
                        }
                    },
                    args: args,
                });
                if (after?.onExecuteDone) {
                    afterCalls.push(after.onExecuteDone);
                }
                if (result !== undefined) {
                    break;
                }
            }
            if (result === undefined) {
                result = (await executeFn({
                    ...args,
                    contextValue: context,
                }));
            }
            const onNextHandler = [];
            const onEndHandler = [];
            for (const afterCb of afterCalls) {
                const hookResult = await afterCb({
                    args: args,
                    result,
                    setResult: newResult => {
                        result = newResult;
                    },
                });
                if (hookResult) {
                    if (hookResult.onNext) {
                        onNextHandler.push(hookResult.onNext);
                    }
                    if (hookResult.onEnd) {
                        onEndHandler.push(hookResult.onEnd);
                    }
                }
            }
            if (onNextHandler.length && (0, utils_js_1.isAsyncIterable)(result)) {
                result = (0, utils_js_1.mapAsyncIterator)(result, async (result) => {
                    for (const onNext of onNextHandler) {
                        await onNext({
                            args: args,
                            result,
                            setResult: newResult => {
                                result = newResult;
                            },
                        });
                    }
                    return result;
                });
            }
            if (onEndHandler.length && (0, utils_js_1.isAsyncIterable)(result)) {
                result = (0, utils_js_1.finalAsyncIterator)(result, () => {
                    for (const onEnd of onEndHandler) {
                        onEnd();
                    }
                });
            }
            return result;
        })
        : (0, utils_js_1.makeExecute)(execute);
    initDone = true;
    // This is done in order to trigger the first schema available, to allow plugins that needs the schema
    // eagerly to have it.
    if (schema) {
        for (const [i, plugin] of plugins.entries()) {
            plugin.onSchemaChange &&
                plugin.onSchemaChange({
                    schema,
                    replaceSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
                });
        }
    }
    return {
        getCurrentSchema() {
            return schema;
        },
        init,
        parse: customParse,
        validate: customValidate,
        execute: customExecute,
        subscribe: customSubscribe,
        contextFactory: customContextFactory,
    };
}
exports.createEnvelopOrchestrator = createEnvelopOrchestrator;
