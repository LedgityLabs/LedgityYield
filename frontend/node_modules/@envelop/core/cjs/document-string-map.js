"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentString = exports.documentStringMap = void 0;
exports.documentStringMap = new WeakMap();
function getDocumentString(document, print) {
    let documentSource = exports.documentStringMap.get(document);
    if (!documentSource && print) {
        documentSource = print(document);
        exports.documentStringMap.set(document, documentSource);
    }
    return documentSource;
}
exports.getDocumentString = getDocumentString;
