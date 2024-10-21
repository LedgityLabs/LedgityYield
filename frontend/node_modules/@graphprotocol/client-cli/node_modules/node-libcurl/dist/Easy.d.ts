/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { NodeLibcurlNativeBinding } from './types';
declare const bindings: NodeLibcurlNativeBinding;
/**
 * This is a Node.js wrapper around the binding {@link EasyNativeBinding | native Easy class}
 *
 * @public
 */
declare class Easy extends bindings.Easy {
}
export { Easy };
//# sourceMappingURL=Easy.d.ts.map