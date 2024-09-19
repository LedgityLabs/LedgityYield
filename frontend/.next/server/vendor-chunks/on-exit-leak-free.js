"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/on-exit-leak-free";
exports.ids = ["vendor-chunks/on-exit-leak-free"];
exports.modules = {

/***/ "(ssr)/../node_modules/on-exit-leak-free/index.js":
/*!**************************************************!*\
  !*** ../node_modules/on-exit-leak-free/index.js ***!
  \**************************************************/
/***/ ((module) => {

eval("\n\nfunction genWrap (wraps, ref, fn, event) {\n  function wrap () {\n    const obj = ref.deref()\n    // This should alway happen, however GC is\n    // undeterministic so it might happen.\n    /* istanbul ignore else */\n    if (obj !== undefined) {\n      fn(obj, event)\n    }\n  }\n\n  wraps[event] = wrap\n  process.once(event, wrap)\n}\n\nconst registry = new FinalizationRegistry(clear)\nconst map = new WeakMap()\n\nfunction clear (wraps) {\n  process.removeListener('exit', wraps.exit)\n  process.removeListener('beforeExit', wraps.beforeExit)\n}\n\nfunction register (obj, fn) {\n  if (obj === undefined) {\n    throw new Error('the object can\\'t be undefined')\n  }\n  const ref = new WeakRef(obj)\n\n  const wraps = {}\n  map.set(obj, wraps)\n  registry.register(obj, wraps)\n\n  genWrap(wraps, ref, fn, 'exit')\n  genWrap(wraps, ref, fn, 'beforeExit')\n}\n\nfunction unregister (obj) {\n  const wraps = map.get(obj)\n  map.delete(obj)\n  if (wraps) {\n    clear(wraps)\n  }\n  registry.unregister(obj)\n}\n\nmodule.exports = {\n  register,\n  unregister\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL29uLWV4aXQtbGVhay1mcmVlL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uLi9ub2RlX21vZHVsZXMvb24tZXhpdC1sZWFrLWZyZWUvaW5kZXguanM/ZmJhMiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gZ2VuV3JhcCAod3JhcHMsIHJlZiwgZm4sIGV2ZW50KSB7XG4gIGZ1bmN0aW9uIHdyYXAgKCkge1xuICAgIGNvbnN0IG9iaiA9IHJlZi5kZXJlZigpXG4gICAgLy8gVGhpcyBzaG91bGQgYWx3YXkgaGFwcGVuLCBob3dldmVyIEdDIGlzXG4gICAgLy8gdW5kZXRlcm1pbmlzdGljIHNvIGl0IG1pZ2h0IGhhcHBlbi5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChvYmogIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm4ob2JqLCBldmVudClcbiAgICB9XG4gIH1cblxuICB3cmFwc1tldmVudF0gPSB3cmFwXG4gIHByb2Nlc3Mub25jZShldmVudCwgd3JhcClcbn1cblxuY29uc3QgcmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoY2xlYXIpXG5jb25zdCBtYXAgPSBuZXcgV2Vha01hcCgpXG5cbmZ1bmN0aW9uIGNsZWFyICh3cmFwcykge1xuICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdleGl0Jywgd3JhcHMuZXhpdClcbiAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcignYmVmb3JlRXhpdCcsIHdyYXBzLmJlZm9yZUV4aXQpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyIChvYmosIGZuKSB7XG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhlIG9iamVjdCBjYW5cXCd0IGJlIHVuZGVmaW5lZCcpXG4gIH1cbiAgY29uc3QgcmVmID0gbmV3IFdlYWtSZWYob2JqKVxuXG4gIGNvbnN0IHdyYXBzID0ge31cbiAgbWFwLnNldChvYmosIHdyYXBzKVxuICByZWdpc3RyeS5yZWdpc3RlcihvYmosIHdyYXBzKVxuXG4gIGdlbldyYXAod3JhcHMsIHJlZiwgZm4sICdleGl0JylcbiAgZ2VuV3JhcCh3cmFwcywgcmVmLCBmbiwgJ2JlZm9yZUV4aXQnKVxufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyIChvYmopIHtcbiAgY29uc3Qgd3JhcHMgPSBtYXAuZ2V0KG9iailcbiAgbWFwLmRlbGV0ZShvYmopXG4gIGlmICh3cmFwcykge1xuICAgIGNsZWFyKHdyYXBzKVxuICB9XG4gIHJlZ2lzdHJ5LnVucmVnaXN0ZXIob2JqKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVnaXN0ZXIsXG4gIHVucmVnaXN0ZXJcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/on-exit-leak-free/index.js\n");

/***/ })

};
;