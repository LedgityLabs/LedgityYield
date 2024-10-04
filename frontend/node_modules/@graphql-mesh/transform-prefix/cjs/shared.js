"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreList = void 0;
const graphql_scalars_1 = require("graphql-scalars");
exports.ignoreList = [
    'Int',
    'Float',
    'String',
    'Boolean',
    'ID',
    'date',
    'hostname',
    'regex',
    'json-pointer',
    'relative-json-pointer',
    'uri-reference',
    'uri-template',
    'ObjMap',
    'HttpMethod',
    ...Object.keys(graphql_scalars_1.resolvers),
];
