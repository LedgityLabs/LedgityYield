"use strict";
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurlFeature = void 0;
/**
 * Flags to be used with {@link "Curl".Curl.enable | `Curl#enable`} and {@link "Curl".Curl.disable | `Curl#disable`}
 * @public
 */
var CurlFeature;
(function (CurlFeature) {
    /**
     * Initial state
     */
    CurlFeature[CurlFeature["Empty"] = 0] = "Empty";
    /**
     * Data received is passed as a Buffer to the end event.
     */
    CurlFeature[CurlFeature["NoDataParsing"] = 1] = "NoDataParsing";
    /**
     * Header received is not parsed, it's passed as a Buffer to the end event.
     */
    CurlFeature[CurlFeature["NoHeaderParsing"] = 2] = "NoHeaderParsing";
    /**
     * Same than `NoDataParsing | NoHeaderParsing`
     */
    CurlFeature[CurlFeature["Raw"] = 3] = "Raw";
    /**
     * Data received is not stored inside this handle, implies `NoDataParsing`.
     */
    CurlFeature[CurlFeature["NoDataStorage"] = 4] = "NoDataStorage";
    /**
     * Header received is not stored inside this handle, implies `NoHeaderParsing`.
     */
    CurlFeature[CurlFeature["NoHeaderStorage"] = 8] = "NoHeaderStorage";
    /**
     * Same than `NoDataStorage | NoHeaderStorage`, implies `Raw`.
     */
    CurlFeature[CurlFeature["NoStorage"] = 12] = "NoStorage";
    /**
     * This will change the behavior of the internal `WRITEFUNCTION` to push data into a stream instead of
     * buffering all the data into multiple `Buffer` chunks.
     *
     * As soon as the stream is available, it will be passed as the first argument for the `stream` event.
     *
     * Example usage:
     *
     * ```typescript
     *  const curl = new Curl()
     *  curl.setOpt('URL', 'https://some-domain/upload')
     *
     *  curl.setStreamProgressCallback(() => {
     *    // this will use the default progress callback from libcurl
     *    return CurlProgressFunc.Continue
     *  })
     *
     *  curl.on('end', (statusCode, data) => {
     *    console.log('\n'.repeat(5))
     *    console.log(
     *      `curl - end - status: ${statusCode} - data length: ${data.length}`,
     *    )
     *    curl.close()
     *  })
     *  curl.on('error', (error, errorCode) => {
     *    console.log('\n'.repeat(5))
     *    console.error('curl - error: ', error, errorCode)
     *    curl.close()
     *  })
     *  curl.on('stream', async (stream, _statusCode, _headers) => {
     *    const writableStream = fs.createWriteStream('./test.out')
     *    stream.pipe(writableStream)
     *  })
     *  curl.perform()
     * ```
     *
     * Using this implies `NoDataStorage`.
     *
     * To control the `highWaterMark` option of the response stream, see {@link "Curl".Curl.setStreamResponseHighWaterMark | `Curl#setStreamResponseHighWaterMark`}
     *
     * @remarks
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     */
    CurlFeature[CurlFeature["StreamResponse"] = 16] = "StreamResponse";
})(CurlFeature || (exports.CurlFeature = CurlFeature = {}));
//# sourceMappingURL=CurlFeature.js.map