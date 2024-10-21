"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeString = exports.findBestMatch = void 0;
const tslib_1 = require("tslib");
const object_inspect_1 = tslib_1.__importDefault(require("object-inspect"));
function compareTwoStrings(str1, str2) {
    if (!str1.length && !str2.length)
        return 1;
    if (!str1.length || !str2.length)
        return 0;
    if (str1.toUpperCase() === str2.toUpperCase())
        return 1;
    if (str1.length === 1 && str2.length === 1)
        return 0;
    const pairs1 = wordLetterPairs(str1);
    const pairs2 = wordLetterPairs(str2);
    const union = pairs1.length + pairs2.length;
    let intersection = 0;
    for (const pair1 of pairs1) {
        for (let i = 0, pair2; (pair2 = pairs2[i]); i++) {
            if (pair1 !== pair2)
                continue;
            intersection++;
            pairs2.splice(i, 1);
            break;
        }
    }
    return (intersection * 2) / union;
}
function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
        throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
    const ratings = targetStrings.map(target => ({
        target,
        rating: compareTwoStrings(mainString, target.value),
    }));
    const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
    return { ratings, bestMatch };
}
exports.findBestMatch = findBestMatch;
function flattenDeep(arr) {
    return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];
}
function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string')
        return false;
    if (!Array.isArray(targetStrings))
        return false;
    if (!targetStrings.length)
        return false;
    if (targetStrings.find(s => typeof s.value !== 'string'))
        return false;
    return true;
}
function letterPairs(str) {
    const pairs = [];
    for (let i = 0, max = str.length - 1; i < max; i++)
        pairs[i] = str.substring(i, i + 2);
    return pairs;
}
function wordLetterPairs(str) {
    const pairs = str.toUpperCase().split(' ').map(letterPairs);
    return flattenDeep(pairs);
}
function safeString(obj) {
    if (typeof obj === 'string') {
        return JSON.stringify(obj);
    }
    return (0, object_inspect_1.default)(obj)
        .replace(/\[Object: null prototype\] /g, '')
        .replace(/(^')|('$)/g, '');
}
exports.safeString = safeString;
