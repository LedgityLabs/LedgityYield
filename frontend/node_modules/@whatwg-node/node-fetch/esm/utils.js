function isHeadersInstance(obj) {
    return obj?.forEach != null;
}
export function getHeadersObj(headers) {
    if (headers == null || !isHeadersInstance(headers)) {
        return headers;
    }
    const obj = {};
    headers.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}
export function defaultHeadersSerializer(headers, onContentLength) {
    const headerArray = [];
    headers.forEach((value, key) => {
        if (onContentLength && key === 'content-length') {
            onContentLength(value);
        }
        headerArray.push(`${key}: ${value}`);
    });
    return headerArray;
}
function isPromise(val) {
    return val?.then != null;
}
export function fakePromise(value) {
    if (isPromise(value)) {
        return value;
    }
    // Write a fake promise to avoid the promise constructor
    // being called with `new Promise` in the browser.
    return {
        then(resolve) {
            if (resolve) {
                const callbackResult = resolve(value);
                if (isPromise(callbackResult)) {
                    return callbackResult;
                }
                return fakePromise(callbackResult);
            }
            return this;
        },
        catch() {
            return this;
        },
        finally(cb) {
            if (cb) {
                const callbackResult = cb();
                if (isPromise(callbackResult)) {
                    return callbackResult.then(() => value);
                }
                return fakePromise(value);
            }
            return this;
        },
        [Symbol.toStringTag]: 'Promise',
    };
}
export function isArrayBufferView(obj) {
    return obj != null && obj.buffer != null && obj.byteLength != null && obj.byteOffset != null;
}
export function isNodeReadable(obj) {
    return obj != null && obj.pipe != null;
}
export function createDeferredPromise() {
    let resolveFn;
    let rejectFn;
    const promise = new Promise(function deferredPromiseExecutor(resolve, reject) {
        resolveFn = resolve;
        rejectFn = reject;
    });
    return {
        promise,
        get resolve() {
            return resolveFn;
        },
        get reject() {
            return rejectFn;
        },
    };
}
