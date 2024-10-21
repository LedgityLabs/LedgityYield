"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Share = void 0;
const CurlShareOption_1 = require("./enum/CurlShareOption");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bindings = require('../lib/binding/node_libcurl.node');
/**
 * This is a Node.js wrapper around the binding {@link EasyNativeBinding | native Easy class}.
 *
 * The only extra is that it provides a static field `option` and `lock`.
 *
 * @public
 */
class Share extends bindings.Share {
}
exports.Share = Share;
/**
 * Options to be used with {@link setOpt | `setOpt`}.
 *
 * See the official documentation of [`curl_share_setopt()`](http://curl.haxx.se/libcurl/c/curl_share_setopt.html)
 *  for reference.
 *
 * `CURLSHOPT_SHARE` becomes `Share.option.SHARE`
 *
 * @deprecated Use {@link CurlShareOption|`CurlShareOption`} directly instead.
 */
Share.option = CurlShareOption_1.CurlShareOption;
//# sourceMappingURL=Share.js.map