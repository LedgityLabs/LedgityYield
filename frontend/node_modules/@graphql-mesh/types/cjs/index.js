"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlConfig = exports.jsonSchema = void 0;
const tslib_1 = require("tslib");
const YamlConfig = tslib_1.__importStar(require("./config.js"));
exports.YamlConfig = YamlConfig;
var config_schema_js_1 = require("./config-schema.js");
Object.defineProperty(exports, "jsonSchema", { enumerable: true, get: function () { return config_schema_js_1.jsonSchema; } });
