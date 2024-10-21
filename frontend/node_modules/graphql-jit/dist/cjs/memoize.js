"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize4 = exports.memoize3 = exports.memoize2 = void 0;
const lodash_memoize_1 = __importDefault(require("lodash.memoize"));
function uncurry2(fn) {
    return (a, b) => fn(a)(b);
}
function uncurry3(fn) {
    return (a, b, c) => fn(a)(b)(c);
}
function uncurry4(fn) {
    return (a, b, c, d) => fn(a)(b)(c)(d);
}
function memoize2(fn) {
    return uncurry2((0, lodash_memoize_1.default)((a) => (0, lodash_memoize_1.default)((b) => fn(a, b))));
}
exports.memoize2 = memoize2;
function memoize3(fn) {
    return uncurry3((0, lodash_memoize_1.default)((a) => (0, lodash_memoize_1.default)((b) => (0, lodash_memoize_1.default)((c) => fn(a, b, c)))));
}
exports.memoize3 = memoize3;
function memoize4(fn) {
    return uncurry4((0, lodash_memoize_1.default)((a) => (0, lodash_memoize_1.default)((b) => (0, lodash_memoize_1.default)((c) => (0, lodash_memoize_1.default)((d) => fn(a, b, c, d))))));
}
exports.memoize4 = memoize4;
//# sourceMappingURL=memoize.js.map