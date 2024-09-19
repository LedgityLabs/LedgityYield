/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/symbol-observable";
exports.ids = ["vendor-chunks/symbol-observable"];
exports.modules = {

/***/ "(ssr)/../node_modules/symbol-observable/lib/ponyfill.js":
/*!*********************************************************!*\
  !*** ../node_modules/symbol-observable/lib/ponyfill.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n\tvalue: true\n}));\nexports[\"default\"] = symbolObservablePonyfill;\nfunction symbolObservablePonyfill(root) {\n\tvar result;\n\tvar _Symbol = root.Symbol;\n\n\tif (typeof _Symbol === 'function') {\n\t\tif (_Symbol.observable) {\n\t\t\tresult = _Symbol.observable;\n\t\t} else {\n\n\t\t\t// This just needs to be something that won't trample other user's Symbol.for use\n\t\t\t// It also will guide people to the source of their issues, if this is problematic.\n\t\t\t// META: It's a resource locator!\n\t\t\tresult = _Symbol['for']('https://github.com/benlesh/symbol-observable');\n\t\t\ttry {\n\t\t\t\t_Symbol.observable = result;\n\t\t\t} catch (err) {\n\t\t\t\t// Do nothing. In some environments, users have frozen `Symbol` for security reasons,\n\t\t\t\t// if it is frozen assigning to it will throw. In this case, we don't care, because\n\t\t\t\t// they will need to use the returned value from the ponyfill.\n\t\t\t}\n\t\t}\n\t} else {\n\t\tresult = '@@observable';\n\t}\n\n\treturn result;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3N5bWJvbC1vYnNlcnZhYmxlL2xpYi9wb255ZmlsbC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uLi9ub2RlX21vZHVsZXMvc3ltYm9sLW9ic2VydmFibGUvbGliL3BvbnlmaWxsLmpzP2QxMzEiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gc3ltYm9sT2JzZXJ2YWJsZVBvbnlmaWxsO1xuZnVuY3Rpb24gc3ltYm9sT2JzZXJ2YWJsZVBvbnlmaWxsKHJvb3QpIHtcblx0dmFyIHJlc3VsdDtcblx0dmFyIF9TeW1ib2wgPSByb290LlN5bWJvbDtcblxuXHRpZiAodHlwZW9mIF9TeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcblx0XHRpZiAoX1N5bWJvbC5vYnNlcnZhYmxlKSB7XG5cdFx0XHRyZXN1bHQgPSBfU3ltYm9sLm9ic2VydmFibGU7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gVGhpcyBqdXN0IG5lZWRzIHRvIGJlIHNvbWV0aGluZyB0aGF0IHdvbid0IHRyYW1wbGUgb3RoZXIgdXNlcidzIFN5bWJvbC5mb3IgdXNlXG5cdFx0XHQvLyBJdCBhbHNvIHdpbGwgZ3VpZGUgcGVvcGxlIHRvIHRoZSBzb3VyY2Ugb2YgdGhlaXIgaXNzdWVzLCBpZiB0aGlzIGlzIHByb2JsZW1hdGljLlxuXHRcdFx0Ly8gTUVUQTogSXQncyBhIHJlc291cmNlIGxvY2F0b3IhXG5cdFx0XHRyZXN1bHQgPSBfU3ltYm9sWydmb3InXSgnaHR0cHM6Ly9naXRodWIuY29tL2Jlbmxlc2gvc3ltYm9sLW9ic2VydmFibGUnKTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdF9TeW1ib2wub2JzZXJ2YWJsZSA9IHJlc3VsdDtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHQvLyBEbyBub3RoaW5nLiBJbiBzb21lIGVudmlyb25tZW50cywgdXNlcnMgaGF2ZSBmcm96ZW4gYFN5bWJvbGAgZm9yIHNlY3VyaXR5IHJlYXNvbnMsXG5cdFx0XHRcdC8vIGlmIGl0IGlzIGZyb3plbiBhc3NpZ25pbmcgdG8gaXQgd2lsbCB0aHJvdy4gSW4gdGhpcyBjYXNlLCB3ZSBkb24ndCBjYXJlLCBiZWNhdXNlXG5cdFx0XHRcdC8vIHRoZXkgd2lsbCBuZWVkIHRvIHVzZSB0aGUgcmV0dXJuZWQgdmFsdWUgZnJvbSB0aGUgcG9ueWZpbGwuXG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9ICdAQG9ic2VydmFibGUnO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/symbol-observable/lib/ponyfill.js\n");

/***/ }),

/***/ "(ssr)/../node_modules/symbol-observable/ponyfill.js":
/*!*****************************************************!*\
  !*** ../node_modules/symbol-observable/ponyfill.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__(/*! ./lib/ponyfill */ \"(ssr)/../node_modules/symbol-observable/lib/ponyfill.js\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3N5bWJvbC1vYnNlcnZhYmxlL3BvbnlmaWxsLmpzIiwibWFwcGluZ3MiOiJBQUFBLHFIQUEwQyIsInNvdXJjZXMiOlsid2VicGFjazovL2xlZGdpdHkteWllbGQtZnJvbnRlbmQvLi4vbm9kZV9tb2R1bGVzL3N5bWJvbC1vYnNlcnZhYmxlL3BvbnlmaWxsLmpzPzk4ODUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9wb255ZmlsbCcpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/symbol-observable/ponyfill.js\n");

/***/ })

};
;