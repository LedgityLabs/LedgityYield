/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CurlNativeBindingObject, CurlVersionInfoNativeBindingObject, EasyNativeBindingObject, MultiNativeBindingObject, ShareNativeBindingObject } from './';
/**
 * This is the interface exported from the addon binding itself.
 * Not available for library users.
 *
 * @internal
 */
export interface NodeLibcurlNativeBinding {
    Curl: CurlNativeBindingObject;
    CurlVersionInfo: CurlVersionInfoNativeBindingObject;
    Easy: EasyNativeBindingObject;
    Multi: MultiNativeBindingObject;
    Share: ShareNativeBindingObject;
}
//# sourceMappingURL=NodeLibcurlNativeBinding.d.ts.map