"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPOSTMultipartRequest = isPOSTMultipartRequest;
exports.parsePOSTMultipartRequest = parsePOSTMultipartRequest;
const dset_1 = require("dset");
const utils_1 = require("@graphql-tools/utils");
const utils_js_1 = require("./utils.js");
function isPOSTMultipartRequest(request) {
    return request.method === 'POST' && (0, utils_js_1.isContentTypeMatch)(request, 'multipart/form-data');
}
async function parsePOSTMultipartRequest(request) {
    let requestBody;
    try {
        requestBody = await request.formData();
    }
    catch (e) {
        if (e instanceof Error && e.message.startsWith('File size limit exceeded: ')) {
            throw (0, utils_1.createGraphQLError)(e.message, {
                extensions: {
                    http: {
                        status: 413,
                    },
                },
            });
        }
        throw e;
    }
    const operationsStr = requestBody.get('operations');
    if (!operationsStr) {
        throw (0, utils_1.createGraphQLError)('Missing multipart form field "operations"');
    }
    if (typeof operationsStr !== 'string') {
        throw (0, utils_1.createGraphQLError)('Multipart form field "operations" must be a string');
    }
    let operations;
    try {
        operations = JSON.parse(operationsStr);
    }
    catch (err) {
        throw (0, utils_1.createGraphQLError)('Multipart form field "operations" must be a valid JSON string');
    }
    const mapStr = requestBody.get('map');
    if (mapStr != null) {
        if (typeof mapStr !== 'string') {
            throw (0, utils_1.createGraphQLError)('Multipart form field "map" must be a string');
        }
        let map;
        try {
            map = JSON.parse(mapStr);
        }
        catch (err) {
            throw (0, utils_1.createGraphQLError)('Multipart form field "map" must be a valid JSON string');
        }
        for (const fileIndex in map) {
            const file = requestBody.get(fileIndex);
            const keys = map[fileIndex];
            for (const key of keys) {
                (0, dset_1.dset)(operations, key, file);
            }
        }
    }
    return operations;
}
