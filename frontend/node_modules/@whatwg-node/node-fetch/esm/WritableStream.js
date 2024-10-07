import { Writable } from 'stream';
import { fakePromise } from './utils.js';
export class PonyfillWritableStream {
    writable;
    constructor(underlyingSink) {
        if (underlyingSink instanceof Writable) {
            this.writable = underlyingSink;
        }
        else if (underlyingSink) {
            const writable = new Writable({
                write(chunk, _encoding, callback) {
                    try {
                        const result = underlyingSink.write?.(chunk, controller);
                        if (result instanceof Promise) {
                            result.then(() => {
                                callback();
                            }, err => {
                                callback(err);
                            });
                        }
                        else {
                            callback();
                        }
                    }
                    catch (err) {
                        callback(err);
                    }
                },
                final(callback) {
                    const result = underlyingSink.close?.();
                    if (result instanceof Promise) {
                        result.then(() => {
                            callback();
                        }, err => {
                            callback(err);
                        });
                    }
                    else {
                        callback();
                    }
                },
            });
            this.writable = writable;
            let onabort;
            let reason;
            const controller = {
                signal: {
                    any(signals) {
                        return AbortSignal.any([...signals]);
                    },
                    get reason() {
                        return reason;
                    },
                    get aborted() {
                        return writable.destroyed;
                    },
                    addEventListener: (_event, eventListener) => {
                        writable.once('error', eventListener);
                        writable.once('close', eventListener);
                    },
                    removeEventListener: (_event, eventListener) => {
                        writable.off('error', eventListener);
                        writable.off('close', eventListener);
                    },
                    dispatchEvent: (_event) => {
                        return false;
                    },
                    get onabort() {
                        return onabort;
                    },
                    set onabort(value) {
                        if (onabort) {
                            this.removeEventListener('abort', onabort);
                        }
                        onabort = value;
                        if (onabort) {
                            this.addEventListener('abort', onabort);
                        }
                    },
                    throwIfAborted() {
                        if (writable.destroyed) {
                            throw reason;
                        }
                    },
                },
                error: e => {
                    this.writable.destroy(e);
                },
            };
            this.writable.once('error', err => {
                reason = err;
            });
        }
        else {
            this.writable = new Writable();
        }
    }
    getWriter() {
        const writable = this.writable;
        return {
            closed: new Promise(resolve => {
                writable.once('close', () => {
                    resolve(undefined);
                });
            }),
            get desiredSize() {
                return writable.writableLength;
            },
            ready: new Promise(resolve => {
                writable.once('drain', () => {
                    resolve(undefined);
                });
            }),
            releaseLock() {
                // no-op
            },
            write(chunk) {
                if (chunk == null) {
                    return fakePromise(undefined);
                }
                return new Promise((resolve, reject) => {
                    writable.write(chunk, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            },
            close() {
                if (!writable.errored && writable.closed) {
                    return fakePromise(undefined);
                }
                return new Promise((resolve, reject) => {
                    if (writable.errored) {
                        reject(writable.errored);
                    }
                    else {
                        writable.end((err) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    }
                });
            },
            abort(reason) {
                return new Promise(resolve => {
                    writable.destroy(reason);
                    writable.once('close', resolve);
                });
            },
        };
    }
    close() {
        if (!this.writable.errored && this.writable.closed) {
            return fakePromise(undefined);
        }
        return new Promise((resolve, reject) => {
            if (this.writable.errored) {
                reject(this.writable.errored);
            }
            else {
                this.writable.end((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }
    abort(reason) {
        return new Promise(resolve => {
            this.writable.destroy(reason);
            this.writable.once('close', resolve);
        });
    }
    locked = false;
}
