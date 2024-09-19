/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/cross-fetch";
exports.ids = ["vendor-chunks/cross-fetch"];
exports.modules = {

/***/ "(ssr)/../node_modules/cross-fetch/dist/node-ponyfill.js":
/*!*********************************************************!*\
  !*** ../node_modules/cross-fetch/dist/node-ponyfill.js ***!
  \*********************************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("const nodeFetch = __webpack_require__(/*! node-fetch */ \"(ssr)/../node_modules/node-fetch/lib/index.mjs\")\nconst realFetch = nodeFetch.default || nodeFetch\n\nconst fetch = function (url, options) {\n  // Support schemaless URIs on the server for parity with the browser.\n  // Ex: //github.com/ -> https://github.com/\n  if (/^\\/\\//.test(url)) {\n    url = 'https:' + url\n  }\n  return realFetch.call(this, url, options)\n}\n\nfetch.ponyfill = true\n\nmodule.exports = exports = fetch\nexports.fetch = fetch\nexports.Headers = nodeFetch.Headers\nexports.Request = nodeFetch.Request\nexports.Response = nodeFetch.Response\n\n// Needed for TypeScript consumers without esModuleInterop.\nexports[\"default\"] = fetch\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL2Nyb3NzLWZldGNoL2Rpc3Qvbm9kZS1wb255ZmlsbC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBWTtBQUN0Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsYUFBYTtBQUNiLGVBQWU7QUFDZixlQUFlO0FBQ2YsZ0JBQWdCOztBQUVoQjtBQUNBLGtCQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uLi9ub2RlX21vZHVsZXMvY3Jvc3MtZmV0Y2gvZGlzdC9ub2RlLXBvbnlmaWxsLmpzPzIyZmEiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm9kZUZldGNoID0gcmVxdWlyZSgnbm9kZS1mZXRjaCcpXG5jb25zdCByZWFsRmV0Y2ggPSBub2RlRmV0Y2guZGVmYXVsdCB8fCBub2RlRmV0Y2hcblxuY29uc3QgZmV0Y2ggPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIC8vIFN1cHBvcnQgc2NoZW1hbGVzcyBVUklzIG9uIHRoZSBzZXJ2ZXIgZm9yIHBhcml0eSB3aXRoIHRoZSBicm93c2VyLlxuICAvLyBFeDogLy9naXRodWIuY29tLyAtPiBodHRwczovL2dpdGh1Yi5jb20vXG4gIGlmICgvXlxcL1xcLy8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gJ2h0dHBzOicgKyB1cmxcbiAgfVxuICByZXR1cm4gcmVhbEZldGNoLmNhbGwodGhpcywgdXJsLCBvcHRpb25zKVxufVxuXG5mZXRjaC5wb255ZmlsbCA9IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmV0Y2hcbmV4cG9ydHMuZmV0Y2ggPSBmZXRjaFxuZXhwb3J0cy5IZWFkZXJzID0gbm9kZUZldGNoLkhlYWRlcnNcbmV4cG9ydHMuUmVxdWVzdCA9IG5vZGVGZXRjaC5SZXF1ZXN0XG5leHBvcnRzLlJlc3BvbnNlID0gbm9kZUZldGNoLlJlc3BvbnNlXG5cbi8vIE5lZWRlZCBmb3IgVHlwZVNjcmlwdCBjb25zdW1lcnMgd2l0aG91dCBlc01vZHVsZUludGVyb3AuXG5leHBvcnRzLmRlZmF1bHQgPSBmZXRjaFxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/cross-fetch/dist/node-ponyfill.js\n");

/***/ })

};
;