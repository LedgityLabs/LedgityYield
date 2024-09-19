"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "(ssr)/../node_modules/motion/dist/animate.es.js":
/*!*************************************************!*\
  !*** ../node_modules/motion/dist/animate.es.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   animate: () => (/* binding */ animate),\n/* harmony export */   animateProgress: () => (/* binding */ animateProgress)\n/* harmony export */ });\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/../node_modules/@motionone/dom/dist/animate/utils/controls.es.js\");\n/* harmony import */ var _motionone_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @motionone/dom */ \"(ssr)/../node_modules/@motionone/dom/dist/animate/index.es.js\");\n/* harmony import */ var _motionone_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @motionone/utils */ \"(ssr)/../node_modules/@motionone/utils/dist/is-function.es.js\");\n/* harmony import */ var _motionone_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @motionone/animation */ \"(ssr)/../node_modules/@motionone/animation/dist/Animation.es.js\");\n\n\n\n\nfunction animateProgress(target, options = {}) {\n    return (0,_motionone_dom__WEBPACK_IMPORTED_MODULE_0__.withControls)([\n        () => {\n            const animation = new _motionone_animation__WEBPACK_IMPORTED_MODULE_1__.Animation(target, [0, 1], options);\n            animation.finished.catch(() => { });\n            return animation;\n        },\n    ], options, options.duration);\n}\nfunction animate(target, keyframesOrOptions, options) {\n    const factory = (0,_motionone_utils__WEBPACK_IMPORTED_MODULE_2__.isFunction)(target) ? animateProgress : _motionone_dom__WEBPACK_IMPORTED_MODULE_3__.animate;\n    return factory(target, keyframesOrOptions, options);\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL21vdGlvbi9kaXN0L2FuaW1hdGUuZXMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQW9FO0FBQ3RCO0FBQ0c7O0FBRWpELDZDQUE2QztBQUM3QyxXQUFXLDREQUFZO0FBQ3ZCO0FBQ0Esa0NBQWtDLDJEQUFTO0FBQzNDLDhDQUE4QztBQUM5QztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNERBQVUsNkJBQTZCLG1EQUFTO0FBQ3BFO0FBQ0E7O0FBRW9DIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5lcy5qcz82Y2JmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUgYXMgYW5pbWF0ZSQxLCB3aXRoQ29udHJvbHMgfSBmcm9tICdAbW90aW9ub25lL2RvbSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnQG1vdGlvbm9uZS91dGlscyc7XG5pbXBvcnQgeyBBbmltYXRpb24gfSBmcm9tICdAbW90aW9ub25lL2FuaW1hdGlvbic7XG5cbmZ1bmN0aW9uIGFuaW1hdGVQcm9ncmVzcyh0YXJnZXQsIG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB3aXRoQ29udHJvbHMoW1xuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKHRhcmdldCwgWzAsIDFdLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5maW5pc2hlZC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICAgICAgfSxcbiAgICBdLCBvcHRpb25zLCBvcHRpb25zLmR1cmF0aW9uKTtcbn1cbmZ1bmN0aW9uIGFuaW1hdGUodGFyZ2V0LCBrZXlmcmFtZXNPck9wdGlvbnMsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBmYWN0b3J5ID0gaXNGdW5jdGlvbih0YXJnZXQpID8gYW5pbWF0ZVByb2dyZXNzIDogYW5pbWF0ZSQxO1xuICAgIHJldHVybiBmYWN0b3J5KHRhcmdldCwga2V5ZnJhbWVzT3JPcHRpb25zLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgYW5pbWF0ZSwgYW5pbWF0ZVByb2dyZXNzIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/motion/dist/animate.es.js\n");

/***/ })

};
;