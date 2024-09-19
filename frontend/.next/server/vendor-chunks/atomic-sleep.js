"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/atomic-sleep";
exports.ids = ["vendor-chunks/atomic-sleep"];
exports.modules = {

/***/ "(ssr)/../node_modules/atomic-sleep/index.js":
/*!*********************************************!*\
  !*** ../node_modules/atomic-sleep/index.js ***!
  \*********************************************/
/***/ ((module) => {

eval("\n\n/* global SharedArrayBuffer, Atomics */\n\nif (typeof SharedArrayBuffer !== 'undefined' && typeof Atomics !== 'undefined') {\n  const nil = new Int32Array(new SharedArrayBuffer(4))\n\n  function sleep (ms) {\n    // also filters out NaN, non-number types, including empty strings, but allows bigints\n    const valid = ms > 0 && ms < Infinity \n    if (valid === false) {\n      if (typeof ms !== 'number' && typeof ms !== 'bigint') {\n        throw TypeError('sleep: ms must be a number')\n      }\n      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')\n    }\n\n    Atomics.wait(nil, 0, 0, Number(ms))\n  }\n  module.exports = sleep\n} else {\n\n  function sleep (ms) {\n    // also filters out NaN, non-number types, including empty strings, but allows bigints\n    const valid = ms > 0 && ms < Infinity \n    if (valid === false) {\n      if (typeof ms !== 'number' && typeof ms !== 'bigint') {\n        throw TypeError('sleep: ms must be a number')\n      }\n      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')\n    }\n    const target = Date.now() + Number(ms)\n    while (target > Date.now()){}\n  }\n\n  module.exports = sleep\n\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL2F0b21pYy1zbGVlcC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2xlZGdpdHkteWllbGQtZnJvbnRlbmQvLi4vbm9kZV9tb2R1bGVzL2F0b21pYy1zbGVlcC9pbmRleC5qcz9mMmFmIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4vKiBnbG9iYWwgU2hhcmVkQXJyYXlCdWZmZXIsIEF0b21pY3MgKi9cblxuaWYgKHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEF0b21pY3MgIT09ICd1bmRlZmluZWQnKSB7XG4gIGNvbnN0IG5pbCA9IG5ldyBJbnQzMkFycmF5KG5ldyBTaGFyZWRBcnJheUJ1ZmZlcig0KSlcblxuICBmdW5jdGlvbiBzbGVlcCAobXMpIHtcbiAgICAvLyBhbHNvIGZpbHRlcnMgb3V0IE5hTiwgbm9uLW51bWJlciB0eXBlcywgaW5jbHVkaW5nIGVtcHR5IHN0cmluZ3MsIGJ1dCBhbGxvd3MgYmlnaW50c1xuICAgIGNvbnN0IHZhbGlkID0gbXMgPiAwICYmIG1zIDwgSW5maW5pdHkgXG4gICAgaWYgKHZhbGlkID09PSBmYWxzZSkge1xuICAgICAgaWYgKHR5cGVvZiBtcyAhPT0gJ251bWJlcicgJiYgdHlwZW9mIG1zICE9PSAnYmlnaW50Jykge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3NsZWVwOiBtcyBtdXN0IGJlIGEgbnVtYmVyJylcbiAgICAgIH1cbiAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3NsZWVwOiBtcyBtdXN0IGJlIGEgbnVtYmVyIHRoYXQgaXMgZ3JlYXRlciB0aGFuIDAgYnV0IGxlc3MgdGhhbiBJbmZpbml0eScpXG4gICAgfVxuXG4gICAgQXRvbWljcy53YWl0KG5pbCwgMCwgMCwgTnVtYmVyKG1zKSlcbiAgfVxuICBtb2R1bGUuZXhwb3J0cyA9IHNsZWVwXG59IGVsc2Uge1xuXG4gIGZ1bmN0aW9uIHNsZWVwIChtcykge1xuICAgIC8vIGFsc28gZmlsdGVycyBvdXQgTmFOLCBub24tbnVtYmVyIHR5cGVzLCBpbmNsdWRpbmcgZW1wdHkgc3RyaW5ncywgYnV0IGFsbG93cyBiaWdpbnRzXG4gICAgY29uc3QgdmFsaWQgPSBtcyA+IDAgJiYgbXMgPCBJbmZpbml0eSBcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodHlwZW9mIG1zICE9PSAnbnVtYmVyJyAmJiB0eXBlb2YgbXMgIT09ICdiaWdpbnQnKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXInKVxuICAgICAgfVxuICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXIgdGhhdCBpcyBncmVhdGVyIHRoYW4gMCBidXQgbGVzcyB0aGFuIEluZmluaXR5JylcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0ID0gRGF0ZS5ub3coKSArIE51bWJlcihtcylcbiAgICB3aGlsZSAodGFyZ2V0ID4gRGF0ZS5ub3coKSl7fVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBzbGVlcFxuXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/atomic-sleep/index.js\n");

/***/ })

};
;