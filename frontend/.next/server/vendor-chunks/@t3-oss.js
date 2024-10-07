"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@t3-oss";
exports.ids = ["vendor-chunks/@t3-oss"];
exports.modules = {

/***/ "(ssr)/../node_modules/@t3-oss/env-core/dist/index.js":
/*!******************************************************!*\
  !*** ../node_modules/@t3-oss/env-core/dist/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnv: () => (/* binding */ createEnv)\n/* harmony export */ });\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ \"(ssr)/../node_modules/zod/lib/index.mjs\");\n\n\nfunction createEnv(opts) {\n    const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env;\n    const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false;\n    if (emptyStringAsUndefined) {\n        for (const [key, value] of Object.entries(runtimeEnv)){\n            if (value === \"\") {\n                delete runtimeEnv[key];\n            }\n        }\n    }\n    const skip = !!opts.skipValidation;\n    // biome-ignore lint/suspicious/noExplicitAny: <explanation>\n    if (skip) return runtimeEnv;\n    const _client = typeof opts.client === \"object\" ? opts.client : {};\n    const _server = typeof opts.server === \"object\" ? opts.server : {};\n    const _shared = typeof opts.shared === \"object\" ? opts.shared : {};\n    const client = (0,zod__WEBPACK_IMPORTED_MODULE_0__.object)(_client);\n    const server = (0,zod__WEBPACK_IMPORTED_MODULE_0__.object)(_server);\n    const shared = (0,zod__WEBPACK_IMPORTED_MODULE_0__.object)(_shared);\n    const isServer = opts.isServer ?? (typeof window === \"undefined\" || \"Deno\" in window);\n    const allClient = client.merge(shared);\n    const allServer = server.merge(shared).merge(client);\n    const parsed = isServer ? allServer.safeParse(runtimeEnv) // on server we can validate all env vars\n     : allClient.safeParse(runtimeEnv); // on client we can only validate the ones that are exposed\n    const onValidationError = opts.onValidationError ?? ((error)=>{\n        console.error(\"❌ Invalid environment variables:\", error.flatten().fieldErrors);\n        throw new Error(\"Invalid environment variables\");\n    });\n    const onInvalidAccess = opts.onInvalidAccess ?? ((_variable)=>{\n        throw new Error(\"❌ Attempted to access a server-side environment variable on the client\");\n    });\n    if (parsed.success === false) {\n        return onValidationError(parsed.error);\n    }\n    const isServerAccess = (prop)=>{\n        if (!opts.clientPrefix) return true;\n        return !prop.startsWith(opts.clientPrefix) && !(prop in shared.shape);\n    };\n    const isValidServerAccess = (prop)=>{\n        return isServer || !isServerAccess(prop);\n    };\n    const ignoreProp = (prop)=>{\n        return prop === \"__esModule\" || prop === \"$$typeof\";\n    };\n    const extendedObj = (opts.extends ?? []).reduce((acc, curr)=>{\n        return Object.assign(acc, curr);\n    }, {});\n    const fullObj = Object.assign(parsed.data, extendedObj);\n    const env = new Proxy(fullObj, {\n        get (target, prop) {\n            if (typeof prop !== \"string\") return undefined;\n            if (ignoreProp(prop)) return undefined;\n            if (!isValidServerAccess(prop)) return onInvalidAccess(prop);\n            return Reflect.get(target, prop);\n        }\n    });\n    // biome-ignore lint/suspicious/noExplicitAny: <explanation>\n    return env;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL0B0My1vc3MvZW52LWNvcmUvZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsMkNBQU07QUFDekIsbUJBQW1CLDJDQUFNO0FBQ3pCLG1CQUFtQiwyQ0FBTTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFcUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWRnaXR5LXlpZWxkLWZyb250ZW5kLy4uL25vZGVfbW9kdWxlcy9AdDMtb3NzL2Vudi1jb3JlL2Rpc3QvaW5kZXguanM/NjUyMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBvYmplY3QgfSBmcm9tICd6b2QnO1xuXG5mdW5jdGlvbiBjcmVhdGVFbnYob3B0cykge1xuICAgIGNvbnN0IHJ1bnRpbWVFbnYgPSBvcHRzLnJ1bnRpbWVFbnZTdHJpY3QgPz8gb3B0cy5ydW50aW1lRW52ID8/IHByb2Nlc3MuZW52O1xuICAgIGNvbnN0IGVtcHR5U3RyaW5nQXNVbmRlZmluZWQgPSBvcHRzLmVtcHR5U3RyaW5nQXNVbmRlZmluZWQgPz8gZmFsc2U7XG4gICAgaWYgKGVtcHR5U3RyaW5nQXNVbmRlZmluZWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocnVudGltZUVudikpe1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJ1bnRpbWVFbnZba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBza2lwID0gISFvcHRzLnNraXBWYWxpZGF0aW9uO1xuICAgIC8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9FeHBsaWNpdEFueTogPGV4cGxhbmF0aW9uPlxuICAgIGlmIChza2lwKSByZXR1cm4gcnVudGltZUVudjtcbiAgICBjb25zdCBfY2xpZW50ID0gdHlwZW9mIG9wdHMuY2xpZW50ID09PSBcIm9iamVjdFwiID8gb3B0cy5jbGllbnQgOiB7fTtcbiAgICBjb25zdCBfc2VydmVyID0gdHlwZW9mIG9wdHMuc2VydmVyID09PSBcIm9iamVjdFwiID8gb3B0cy5zZXJ2ZXIgOiB7fTtcbiAgICBjb25zdCBfc2hhcmVkID0gdHlwZW9mIG9wdHMuc2hhcmVkID09PSBcIm9iamVjdFwiID8gb3B0cy5zaGFyZWQgOiB7fTtcbiAgICBjb25zdCBjbGllbnQgPSBvYmplY3QoX2NsaWVudCk7XG4gICAgY29uc3Qgc2VydmVyID0gb2JqZWN0KF9zZXJ2ZXIpO1xuICAgIGNvbnN0IHNoYXJlZCA9IG9iamVjdChfc2hhcmVkKTtcbiAgICBjb25zdCBpc1NlcnZlciA9IG9wdHMuaXNTZXJ2ZXIgPz8gKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgfHwgXCJEZW5vXCIgaW4gd2luZG93KTtcbiAgICBjb25zdCBhbGxDbGllbnQgPSBjbGllbnQubWVyZ2Uoc2hhcmVkKTtcbiAgICBjb25zdCBhbGxTZXJ2ZXIgPSBzZXJ2ZXIubWVyZ2Uoc2hhcmVkKS5tZXJnZShjbGllbnQpO1xuICAgIGNvbnN0IHBhcnNlZCA9IGlzU2VydmVyID8gYWxsU2VydmVyLnNhZmVQYXJzZShydW50aW1lRW52KSAvLyBvbiBzZXJ2ZXIgd2UgY2FuIHZhbGlkYXRlIGFsbCBlbnYgdmFyc1xuICAgICA6IGFsbENsaWVudC5zYWZlUGFyc2UocnVudGltZUVudik7IC8vIG9uIGNsaWVudCB3ZSBjYW4gb25seSB2YWxpZGF0ZSB0aGUgb25lcyB0aGF0IGFyZSBleHBvc2VkXG4gICAgY29uc3Qgb25WYWxpZGF0aW9uRXJyb3IgPSBvcHRzLm9uVmFsaWRhdGlvbkVycm9yID8/ICgoZXJyb3IpPT57XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLinYwgSW52YWxpZCBlbnZpcm9ubWVudCB2YXJpYWJsZXM6XCIsIGVycm9yLmZsYXR0ZW4oKS5maWVsZEVycm9ycyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZW52aXJvbm1lbnQgdmFyaWFibGVzXCIpO1xuICAgIH0pO1xuICAgIGNvbnN0IG9uSW52YWxpZEFjY2VzcyA9IG9wdHMub25JbnZhbGlkQWNjZXNzID8/ICgoX3ZhcmlhYmxlKT0+e1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLinYwgQXR0ZW1wdGVkIHRvIGFjY2VzcyBhIHNlcnZlci1zaWRlIGVudmlyb25tZW50IHZhcmlhYmxlIG9uIHRoZSBjbGllbnRcIik7XG4gICAgfSk7XG4gICAgaWYgKHBhcnNlZC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gb25WYWxpZGF0aW9uRXJyb3IocGFyc2VkLmVycm9yKTtcbiAgICB9XG4gICAgY29uc3QgaXNTZXJ2ZXJBY2Nlc3MgPSAocHJvcCk9PntcbiAgICAgICAgaWYgKCFvcHRzLmNsaWVudFByZWZpeCkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiAhcHJvcC5zdGFydHNXaXRoKG9wdHMuY2xpZW50UHJlZml4KSAmJiAhKHByb3AgaW4gc2hhcmVkLnNoYXBlKTtcbiAgICB9O1xuICAgIGNvbnN0IGlzVmFsaWRTZXJ2ZXJBY2Nlc3MgPSAocHJvcCk9PntcbiAgICAgICAgcmV0dXJuIGlzU2VydmVyIHx8ICFpc1NlcnZlckFjY2Vzcyhwcm9wKTtcbiAgICB9O1xuICAgIGNvbnN0IGlnbm9yZVByb3AgPSAocHJvcCk9PntcbiAgICAgICAgcmV0dXJuIHByb3AgPT09IFwiX19lc01vZHVsZVwiIHx8IHByb3AgPT09IFwiJCR0eXBlb2ZcIjtcbiAgICB9O1xuICAgIGNvbnN0IGV4dGVuZGVkT2JqID0gKG9wdHMuZXh0ZW5kcyA/PyBbXSkucmVkdWNlKChhY2MsIGN1cnIpPT57XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGFjYywgY3Vycik7XG4gICAgfSwge30pO1xuICAgIGNvbnN0IGZ1bGxPYmogPSBPYmplY3QuYXNzaWduKHBhcnNlZC5kYXRhLCBleHRlbmRlZE9iaik7XG4gICAgY29uc3QgZW52ID0gbmV3IFByb3h5KGZ1bGxPYmosIHtcbiAgICAgICAgZ2V0ICh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChpZ25vcmVQcm9wKHByb3ApKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkU2VydmVyQWNjZXNzKHByb3ApKSByZXR1cm4gb25JbnZhbGlkQWNjZXNzKHByb3ApO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vRXhwbGljaXRBbnk6IDxleHBsYW5hdGlvbj5cbiAgICByZXR1cm4gZW52O1xufVxuXG5leHBvcnQgeyBjcmVhdGVFbnYgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/@t3-oss/env-core/dist/index.js\n");

/***/ }),

/***/ "(ssr)/../node_modules/@t3-oss/env-nextjs/dist/index.js":
/*!********************************************************!*\
  !*** ../node_modules/@t3-oss/env-nextjs/dist/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEnv: () => (/* binding */ createEnv)\n/* harmony export */ });\n/* harmony import */ var _t3_oss_env_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @t3-oss/env-core */ \"(ssr)/../node_modules/@t3-oss/env-core/dist/index.js\");\n\n\nconst CLIENT_PREFIX = \"NEXT_PUBLIC_\";\nfunction createEnv(opts) {\n    const client = typeof opts.client === \"object\" ? opts.client : {};\n    const server = typeof opts.server === \"object\" ? opts.server : {};\n    const shared = opts.shared;\n    const runtimeEnv = opts.runtimeEnv ? opts.runtimeEnv : {\n        ...process.env,\n        ...opts.experimental__runtimeEnv\n    };\n    return (0,_t3_oss_env_core__WEBPACK_IMPORTED_MODULE_0__.createEnv)({\n        ...opts,\n        shared,\n        client,\n        server,\n        clientPrefix: CLIENT_PREFIX,\n        runtimeEnv\n    });\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL0B0My1vc3MvZW52LW5leHRqcy9kaXN0L2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQTREOztBQUU1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLDJEQUFXO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFcUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWRnaXR5LXlpZWxkLWZyb250ZW5kLy4uL25vZGVfbW9kdWxlcy9AdDMtb3NzL2Vudi1uZXh0anMvZGlzdC9pbmRleC5qcz83MDE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUVudiBhcyBjcmVhdGVFbnYkMSB9IGZyb20gJ0B0My1vc3MvZW52LWNvcmUnO1xuXG5jb25zdCBDTElFTlRfUFJFRklYID0gXCJORVhUX1BVQkxJQ19cIjtcbmZ1bmN0aW9uIGNyZWF0ZUVudihvcHRzKSB7XG4gICAgY29uc3QgY2xpZW50ID0gdHlwZW9mIG9wdHMuY2xpZW50ID09PSBcIm9iamVjdFwiID8gb3B0cy5jbGllbnQgOiB7fTtcbiAgICBjb25zdCBzZXJ2ZXIgPSB0eXBlb2Ygb3B0cy5zZXJ2ZXIgPT09IFwib2JqZWN0XCIgPyBvcHRzLnNlcnZlciA6IHt9O1xuICAgIGNvbnN0IHNoYXJlZCA9IG9wdHMuc2hhcmVkO1xuICAgIGNvbnN0IHJ1bnRpbWVFbnYgPSBvcHRzLnJ1bnRpbWVFbnYgPyBvcHRzLnJ1bnRpbWVFbnYgOiB7XG4gICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICAuLi5vcHRzLmV4cGVyaW1lbnRhbF9fcnVudGltZUVudlxuICAgIH07XG4gICAgcmV0dXJuIGNyZWF0ZUVudiQxKHtcbiAgICAgICAgLi4ub3B0cyxcbiAgICAgICAgc2hhcmVkLFxuICAgICAgICBjbGllbnQsXG4gICAgICAgIHNlcnZlcixcbiAgICAgICAgY2xpZW50UHJlZml4OiBDTElFTlRfUFJFRklYLFxuICAgICAgICBydW50aW1lRW52XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUVudiB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/@t3-oss/env-nextjs/dist/index.js\n");

/***/ })

};
;