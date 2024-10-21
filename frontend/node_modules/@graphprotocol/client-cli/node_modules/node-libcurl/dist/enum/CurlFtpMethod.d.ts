/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Object with constants for option `FTP_FILEMETHOD`
 *
 * `CURLFTPMETHOD_MULTICWD` becomes `CurlFtpMethod.MULTICWD`
 *
 * This is not following the PascalCase naming format because of a mistake. To not cause a breaking change
 *  it will stay this way until the next major version bump.
 *
 * @public
 */
export declare enum CurlFtpMethod {
    /**
     * let libcurl pick
     */
    DEFAULT = 0,
    /**
     * single CWD operation for each path part
     */
    MULTICWD = 1,
    /**
     * no CWD at all
     */
    NOCWD = 2,
    /**
     * one CWD to full dir, then work on file
     */
    SINGLECWD = 3
}
//# sourceMappingURL=CurlFtpMethod.d.ts.map