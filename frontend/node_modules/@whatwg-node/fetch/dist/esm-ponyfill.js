const fetch = window.fetch;
const Headers = window.Headers;
const Request = window.Request;
const Response = window.Response;
const FormData = window.FormData;
const ReadableStream = window.ReadableStream;
const WritableStream = window.WritableStream;
const TransformStream = window.TransformStream;
const CompressionStream = window.CompressionStream;
const DecompressionStream = window.DecompressionStream;
const Blob = window.Blob;
const File = window.File;
const crypto = window.crypto;
const btoa = window.btoa;
const TextEncoder = window.TextEncoder;
const TextDecoder = window.TextDecoder;
const URLPattern = window.URLPattern;
const URL = window.URL;
const URLSearchParams = window.URLSearchParams;


export {
    fetch,
    Headers,
    Request,
    Response,
    FormData,
    ReadableStream,
    WritableStream,
    TransformStream,
    CompressionStream,
    DecompressionStream,
    Blob,
    File,
    crypto,
    btoa,
    TextEncoder,
    TextDecoder,
    URLPattern,
    URL,
    URLSearchParams
}

export function createFetch() {
    return {
        fetch,
        Headers,
        Request,
        Response,
        FormData,
        ReadableStream,
        WritableStream,
        TransformStream,
        CompressionStream,
        DecompressionStream,
        Blob,
        File,
        crypto,
        btoa,
        TextEncoder,
        TextDecoder,
        URLPattern,
        URL,
        URLSearchParams
    };
}