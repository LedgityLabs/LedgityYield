"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComplexPluginOutput = void 0;
function isComplexPluginOutput(obj) {
    return typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'content');
}
exports.isComplexPluginOutput = isComplexPluginOutput;
