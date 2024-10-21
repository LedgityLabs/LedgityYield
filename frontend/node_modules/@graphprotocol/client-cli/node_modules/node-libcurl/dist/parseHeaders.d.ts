/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Whe data parsing is enabled on the {@link "Curl".Curl} instance, the headers parameter passed
 *  to the `end` event's callback will be one array of this type.
 * @public
 */
export type HeaderInfo = {
    result?: {
        version: string;
        code: number;
        reason: string;
    };
} & {
    'Set-Cookie'?: string[];
} & {
    [headerKey: string]: string;
};
/**
 * Parses the headers that were stored while
 *  the request was being processed.
 *
 * @internal
 */
export declare function parseHeaders(headersString: string): HeaderInfo[];
//# sourceMappingURL=parseHeaders.d.ts.map