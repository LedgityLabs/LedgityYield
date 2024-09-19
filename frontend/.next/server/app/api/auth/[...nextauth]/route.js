"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/../node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/../node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/../node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_torof_Desktop_LedgityYield_frontend_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/home/torof/Desktop/LedgityYield/frontend/src/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _home_torof_Desktop_LedgityYield_frontend_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1hcHAtbG9hZGVyLmpzP25hbWU9YXBwJTJGYXBpJTJGYXV0aCUyRiU1Qi4uLm5leHRhdXRoJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZS50cyZhcHBEaXI9JTJGaG9tZSUyRnRvcm9mJTJGRGVza3RvcCUyRkxlZGdpdHlZaWVsZCUyRmZyb250ZW5kJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGdG9yb2YlMkZEZXNrdG9wJTJGTGVkZ2l0eVlpZWxkJTJGZnJvbnRlbmQmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2lDO0FBQzlHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8/YWQ3YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS90b3JvZi9EZXNrdG9wL0xlZGdpdHlZaWVsZC9mcm9udGVuZC9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvdG9yb2YvRGVza3RvcC9MZWRnaXR5WWllbGQvZnJvbnRlbmQvc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/options.ts":
/*!***************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/options.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   nextAuthOptions: () => (/* binding */ nextAuthOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_twitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/twitter */ \"(rsc)/../node_modules/next-auth/providers/twitter.js\");\n/* harmony import */ var _env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../env.mjs */ \"(rsc)/./env.mjs\");\n/* harmony import */ var _auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @auth/prisma-adapter */ \"(rsc)/../node_modules/@auth/prisma-adapter/index.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n\n\n\n\nconst nextAuthOptions = {\n    // @ts-ignore\n    adapter: (0,_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__.PrismaAdapter)(_lib_db__WEBPACK_IMPORTED_MODULE_3__.prisma),\n    providers: [\n        (0,next_auth_providers_twitter__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            clientId: _env_mjs__WEBPACK_IMPORTED_MODULE_1__.env.TWITTER_CLIENT_ID,\n            clientSecret: _env_mjs__WEBPACK_IMPORTED_MODULE_1__.env.TWITTER_CLIENT_SECRET,\n            version: \"2.0\"\n        })\n    ],\n    session: {\n        maxAge: 30 * 24 * 60 * 60,\n        updateAge: 24 * 60 * 60\n    },\n    theme: {\n        logo: \"/assets/logo/logoLight.svg\",\n        buttonText: \"#e0e7ff\",\n        brandColor: \"#6366f1\"\n    },\n    callbacks: {\n        async session ({ session, user }) {\n            if (session.user) {\n                session.user.id = user.id;\n                //@ts-ignore\n                session.user.twitterId = user.twitterId;\n                //@ts-ignore\n                session.user.walletAddress = user.walletAddress;\n            }\n            return session;\n        }\n    },\n    events: {\n        async signIn (message) {\n            if (message.isNewUser) {\n                await _lib_db__WEBPACK_IMPORTED_MODULE_3__.prisma.user.update({\n                    where: {\n                        id: message.user.id\n                    },\n                    data: {\n                        twitterId: message.account?.providerAccountId\n                    }\n                });\n            }\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vb3B0aW9ucy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEwRDtBQUNiO0FBQ1E7QUFDbkI7QUFpQjNCLE1BQU1JLGtCQUFtQztJQUM5QyxhQUFhO0lBQ2JDLFNBQVNILG1FQUFhQSxDQUFDQywyQ0FBTUE7SUFDN0JHLFdBQVc7UUFDVE4sdUVBQWVBLENBQUM7WUFDZE8sVUFBVU4seUNBQUdBLENBQUNPLGlCQUFpQjtZQUMvQkMsY0FBY1IseUNBQUdBLENBQUNTLHFCQUFxQjtZQUN2Q0MsU0FBUztRQUNYO0tBQ0Q7SUFDREMsU0FBUztRQUNQQyxRQUFRLEtBQUssS0FBSyxLQUFLO1FBQ3ZCQyxXQUFXLEtBQUssS0FBSztJQUN2QjtJQUNBQyxPQUFPO1FBQ0xDLE1BQU07UUFDTkMsWUFBWTtRQUNaQyxZQUFZO0lBQ2Q7SUFDQUMsV0FBVztRQUNULE1BQU1QLFNBQVEsRUFBRUEsT0FBTyxFQUFFUSxJQUFJLEVBQUU7WUFDN0IsSUFBSVIsUUFBUVEsSUFBSSxFQUFFO2dCQUNoQlIsUUFBUVEsSUFBSSxDQUFDQyxFQUFFLEdBQUdELEtBQUtDLEVBQUU7Z0JBQ3pCLFlBQVk7Z0JBQ1pULFFBQVFRLElBQUksQ0FBQ0UsU0FBUyxHQUFHRixLQUFLRSxTQUFTO2dCQUN2QyxZQUFZO2dCQUNaVixRQUFRUSxJQUFJLENBQUNHLGFBQWEsR0FBR0gsS0FBS0csYUFBYTtZQUNqRDtZQUNBLE9BQU9YO1FBQ1Q7SUFDRjtJQUNBWSxRQUFRO1FBQ04sTUFBTUMsUUFBT0MsT0FBTztZQUNsQixJQUFJQSxRQUFRQyxTQUFTLEVBQUU7Z0JBQ3JCLE1BQU14QiwyQ0FBTUEsQ0FBQ2lCLElBQUksQ0FBQ1EsTUFBTSxDQUFDO29CQUN2QkMsT0FBTzt3QkFDTFIsSUFBSUssUUFBUU4sSUFBSSxDQUFDQyxFQUFFO29CQUNyQjtvQkFDQVMsTUFBTTt3QkFDSlIsV0FBV0ksUUFBUUssT0FBTyxFQUFFQztvQkFDOUI7Z0JBQ0Y7WUFDRjtRQUNGO0lBQ0Y7QUFDRixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9vcHRpb25zLnRzP2EyYzYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFR3aXR0ZXJQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy90d2l0dGVyXCI7XG5pbXBvcnQgeyBlbnYgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vZW52Lm1qc1wiO1xuaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gXCJAYXV0aC9wcmlzbWEtYWRhcHRlclwiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL2RiXCI7XG5pbXBvcnQgeyBEZWZhdWx0U2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gXCJuZXh0LWF1dGhcIjtcblxuZGVjbGFyZSBtb2R1bGUgXCJuZXh0LWF1dGhcIiB7XG4gIC8qKlxuICAgKiBSZXR1cm5lZCBieSBgdXNlU2Vzc2lvbmAsIGBnZXRTZXNzaW9uYCBhbmQgcmVjZWl2ZWQgYXMgYSBwcm9wIG9uIHRoZSBgU2Vzc2lvblByb3ZpZGVyYCBSZWFjdCBDb250ZXh0XG4gICAqL1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ6IHN0cmluZztcbiAgICAgIHR3aXR0ZXJJZDogc3RyaW5nO1xuICAgICAgd2FsbGV0QWRkcmVzczogc3RyaW5nIHwgbnVsbDtcbiAgICB9ICYgRGVmYXVsdFNlc3Npb25bXCJ1c2VyXCJdO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBuZXh0QXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgLy8gQHRzLWlnbm9yZVxuICBhZGFwdGVyOiBQcmlzbWFBZGFwdGVyKHByaXNtYSksXG4gIHByb3ZpZGVyczogW1xuICAgIFR3aXR0ZXJQcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogZW52LlRXSVRURVJfQ0xJRU5UX0lELFxuICAgICAgY2xpZW50U2VjcmV0OiBlbnYuVFdJVFRFUl9DTElFTlRfU0VDUkVULFxuICAgICAgdmVyc2lvbjogXCIyLjBcIixcbiAgICB9KSxcbiAgXSxcbiAgc2Vzc2lvbjoge1xuICAgIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAsIC8vIDMwIGRheXNcbiAgICB1cGRhdGVBZ2U6IDI0ICogNjAgKiA2MCwgLy8gMjQgaG91cnNcbiAgfSxcbiAgdGhlbWU6IHtcbiAgICBsb2dvOiBcIi9hc3NldHMvbG9nby9sb2dvTGlnaHQuc3ZnXCIsXG4gICAgYnV0dG9uVGV4dDogXCIjZTBlN2ZmXCIsXG4gICAgYnJhbmRDb2xvcjogXCIjNjM2NmYxXCIsXG4gIH0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB1c2VyIH0pIHtcbiAgICAgIGlmIChzZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdXNlci5pZDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHNlc3Npb24udXNlci50d2l0dGVySWQgPSB1c2VyLnR3aXR0ZXJJZDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHNlc3Npb24udXNlci53YWxsZXRBZGRyZXNzID0gdXNlci53YWxsZXRBZGRyZXNzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfSxcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgYXN5bmMgc2lnbkluKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmlzTmV3VXNlcikge1xuICAgICAgICBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xuICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICBpZDogbWVzc2FnZS51c2VyLmlkLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdHdpdHRlcklkOiBtZXNzYWdlLmFjY291bnQ/LnByb3ZpZGVyQWNjb3VudElkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbIlR3aXR0ZXJQcm92aWRlciIsImVudiIsIlByaXNtYUFkYXB0ZXIiLCJwcmlzbWEiLCJuZXh0QXV0aE9wdGlvbnMiLCJhZGFwdGVyIiwicHJvdmlkZXJzIiwiY2xpZW50SWQiLCJUV0lUVEVSX0NMSUVOVF9JRCIsImNsaWVudFNlY3JldCIsIlRXSVRURVJfQ0xJRU5UX1NFQ1JFVCIsInZlcnNpb24iLCJzZXNzaW9uIiwibWF4QWdlIiwidXBkYXRlQWdlIiwidGhlbWUiLCJsb2dvIiwiYnV0dG9uVGV4dCIsImJyYW5kQ29sb3IiLCJjYWxsYmFja3MiLCJ1c2VyIiwiaWQiLCJ0d2l0dGVySWQiLCJ3YWxsZXRBZGRyZXNzIiwiZXZlbnRzIiwic2lnbkluIiwibWVzc2FnZSIsImlzTmV3VXNlciIsInVwZGF0ZSIsIndoZXJlIiwiZGF0YSIsImFjY291bnQiLCJwcm92aWRlckFjY291bnRJZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/options.ts\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/../node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./options */ \"(rsc)/./src/app/api/auth/[...nextauth]/options.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_options__WEBPACK_IMPORTED_MODULE_1__.nextAuthOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBaUM7QUFDVztBQUU1QyxNQUFNRSxVQUFVRixnREFBUUEsQ0FBQ0MscURBQWVBO0FBRUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWRnaXR5LXlpZWxkLWZyb250ZW5kLy4vc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzPzAwOTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoIGZyb20gXCJuZXh0LWF1dGhcIjtcbmltcG9ydCB7IG5leHRBdXRoT3B0aW9ucyB9IGZyb20gXCIuL29wdGlvbnNcIjtcblxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKG5leHRBdXRoT3B0aW9ucyk7XG5cbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIm5leHRBdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUV2QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQSxHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGVkZ2l0eS15aWVsZC1mcm9udGVuZC8uL3NyYy9saWIvZGIudHM/OWU0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./env.mjs":
/*!*****************!*\
  !*** ./env.mjs ***!
  \*****************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   env: () => (/* binding */ env)\n/* harmony export */ });\n/* harmony import */ var _t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @t3-oss/env-nextjs */ \"(rsc)/../node_modules/@t3-oss/env-nextjs/dist/index.js\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! zod */ \"(rsc)/../node_modules/zod/lib/index.mjs\");\n\n\nconst env = (0,_t3_oss_env_nextjs__WEBPACK_IMPORTED_MODULE_0__.createEnv)({\n    server: {\n        TWITTER_CLIENT_ID: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().optional(),\n        TWITTER_CLIENT_SECRET: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().optional(),\n        IPINFO_TOKEN: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().optional(),\n        SCORECHAIN_API_KEY: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().optional(),\n        AML_ALERT_WEBHOOK: zod__WEBPACK_IMPORTED_MODULE_1__.z.string().url().optional()\n    },\n    client: {\n        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),\n        NEXT_PUBLIC_INTEGRATOR_ID: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),\n        NEXT_PUBLIC_FRONTEND_URL: zod__WEBPACK_IMPORTED_MODULE_1__.z.string(),\n        NEXT_PUBLIC_AFFILIATE_API_URL: zod__WEBPACK_IMPORTED_MODULE_1__.z.string()\n    },\n    experimental__runtimeEnv: {\n        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: \"ce12aab59b3d96e9f440f7e476d4df7f\",\n        NEXT_PUBLIC_INTEGRATOR_ID: \"aabe75510eae1d37568b\",\n        NEXT_PUBLIC_FRONTEND_URL: \"\\\"\\\"https://ledgity.finance/\",\n        NEXT_PUBLIC_AFFILIATE_API_URL: \"https://ledgity-affiliate-backend.onrender.com\"\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9lbnYubWpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUErQztBQUN2QjtBQUVqQixNQUFNRSxNQUFNRiw2REFBU0EsQ0FBQztJQUMzQkcsUUFBUTtRQUNOQyxtQkFBbUJILGtDQUFDQSxDQUFDSSxNQUFNLEdBQUdDLFFBQVE7UUFDdENDLHVCQUF1Qk4sa0NBQUNBLENBQUNJLE1BQU0sR0FBR0MsUUFBUTtRQUMxQ0UsY0FBY1Asa0NBQUNBLENBQUNJLE1BQU0sR0FBR0MsUUFBUTtRQUNqQ0csb0JBQW9CUixrQ0FBQ0EsQ0FBQ0ksTUFBTSxHQUFHQyxRQUFRO1FBQ3ZDSSxtQkFBbUJULGtDQUFDQSxDQUFDSSxNQUFNLEdBQUdNLEdBQUcsR0FBR0wsUUFBUTtJQUM5QztJQUNBTSxRQUFRO1FBQ05DLHNDQUFzQ1osa0NBQUNBLENBQUNJLE1BQU07UUFDOUNTLDJCQUEyQmIsa0NBQUNBLENBQUNJLE1BQU07UUFDbkNVLDBCQUEwQmQsa0NBQUNBLENBQUNJLE1BQU07UUFDbENXLCtCQUErQmYsa0NBQUNBLENBQUNJLE1BQU07SUFDekM7SUFDQVksMEJBQTBCO1FBQ3hCSixzQ0FBc0NLLGtDQUFnRDtRQUN0RkosMkJBQTJCSSxzQkFBcUM7UUFDaEVILDBCQUEwQkcsOEJBQW9DO1FBQzlERiwrQkFBK0JFLGdEQUF5QztJQUMxRTtBQUNGLEdBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sZWRnaXR5LXlpZWxkLWZyb250ZW5kLy4vZW52Lm1qcz82M2M0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUVudiB9IGZyb20gXCJAdDMtb3NzL2Vudi1uZXh0anNcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbmV4cG9ydCBjb25zdCBlbnYgPSBjcmVhdGVFbnYoe1xuICBzZXJ2ZXI6IHtcbiAgICBUV0lUVEVSX0NMSUVOVF9JRDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIFRXSVRURVJfQ0xJRU5UX1NFQ1JFVDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIElQSU5GT19UT0tFTjogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIFNDT1JFQ0hBSU5fQVBJX0tFWTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIEFNTF9BTEVSVF9XRUJIT09LOiB6LnN0cmluZygpLnVybCgpLm9wdGlvbmFsKCksXG4gIH0sXG4gIGNsaWVudDoge1xuICAgIE5FWFRfUFVCTElDX1dBTExFVENPTk5FQ1RfUFJPSkVDVF9JRDogei5zdHJpbmcoKSxcbiAgICBORVhUX1BVQkxJQ19JTlRFR1JBVE9SX0lEOiB6LnN0cmluZygpLFxuICAgIE5FWFRfUFVCTElDX0ZST05URU5EX1VSTDogei5zdHJpbmcoKSxcbiAgICBORVhUX1BVQkxJQ19BRkZJTElBVEVfQVBJX1VSTDogei5zdHJpbmcoKSxcbiAgfSxcbiAgZXhwZXJpbWVudGFsX19ydW50aW1lRW52OiB7XG4gICAgTkVYVF9QVUJMSUNfV0FMTEVUQ09OTkVDVF9QUk9KRUNUX0lEOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19XQUxMRVRDT05ORUNUX1BST0pFQ1RfSUQsXG4gICAgTkVYVF9QVUJMSUNfSU5URUdSQVRPUl9JRDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfSU5URUdSQVRPUl9JRCxcbiAgICBORVhUX1BVQkxJQ19GUk9OVEVORF9VUkw6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0ZST05URU5EX1VSTCxcbiAgICBORVhUX1BVQkxJQ19BRkZJTElBVEVfQVBJX1VSTDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQUZGSUxJQVRFX0FQSV9VUkwsXG4gIH0sXG59KTsiXSwibmFtZXMiOlsiY3JlYXRlRW52IiwieiIsImVudiIsInNlcnZlciIsIlRXSVRURVJfQ0xJRU5UX0lEIiwic3RyaW5nIiwib3B0aW9uYWwiLCJUV0lUVEVSX0NMSUVOVF9TRUNSRVQiLCJJUElORk9fVE9LRU4iLCJTQ09SRUNIQUlOX0FQSV9LRVkiLCJBTUxfQUxFUlRfV0VCSE9PSyIsInVybCIsImNsaWVudCIsIk5FWFRfUFVCTElDX1dBTExFVENPTk5FQ1RfUFJPSkVDVF9JRCIsIk5FWFRfUFVCTElDX0lOVEVHUkFUT1JfSUQiLCJORVhUX1BVQkxJQ19GUk9OVEVORF9VUkwiLCJORVhUX1BVQkxJQ19BRkZJTElBVEVfQVBJX1VSTCIsImV4cGVyaW1lbnRhbF9fcnVudGltZUVudiIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./env.mjs\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/zod","vendor-chunks/preact","vendor-chunks/@t3-oss","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/uuid","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/@auth"], () => (__webpack_exec__("(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Ftorof%2FDesktop%2FLedgityYield%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();