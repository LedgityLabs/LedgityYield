"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLimitBatching = useLimitBatching;
const error_js_1 = require("../../error.js");
function useLimitBatching(limit) {
    return {
        onRequestParse() {
            return {
                onRequestParseDone({ requestParserResult }) {
                    if (Array.isArray(requestParserResult)) {
                        if (!limit) {
                            throw (0, error_js_1.createGraphQLError)(`Batching is not supported.`, {
                                extensions: {
                                    http: {
                                        status: 400,
                                    },
                                },
                            });
                        }
                        if (requestParserResult.length > limit) {
                            throw (0, error_js_1.createGraphQLError)(`Batching is limited to ${limit} operations per request.`, {
                                extensions: {
                                    http: {
                                        status: 413,
                                    },
                                },
                            });
                        }
                    }
                },
            };
        },
    };
}
