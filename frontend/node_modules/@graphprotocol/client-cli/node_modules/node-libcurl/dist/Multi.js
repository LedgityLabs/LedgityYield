"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multi = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bindings = require('../lib/binding/node_libcurl.node');
/**
 * This is a Node.js wrapper around the binding {@link MultiNativeBinding | native Multi class}.
 *
 * The only extra is that it provides a static field `option`.
 *
 * @public
 */
class Multi extends bindings.Multi {
}
exports.Multi = Multi;
/**
 * Options to be used with {@link setOpt | `setOpt`}.
 *
 * See the official documentation of [`curl_multi_setopt()`](http://curl.haxx.se/libcurl/c/curl_multi_setopt.html)
 *  for reference.
 *
 * `CURLMOPT_MAXCONNECTS` becomes `Multi.option.MAXCONNECTS`
 */
Multi.option = bindings.Curl.multi;
//# sourceMappingURL=Multi.js.map