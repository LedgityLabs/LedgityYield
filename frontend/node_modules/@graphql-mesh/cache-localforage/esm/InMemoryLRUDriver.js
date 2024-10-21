import { createLruCache } from '@graphql-mesh/utils';
function nextTick() {
    // Make sure this is scheduled for next tick because LRU Cache is synchronous
    // This helps for testing multiple Mesh instances pointing to the same cache
    return new Promise(resolve => setTimeout(resolve));
}
export function createInMemoryLRUDriver(ttl) {
    let lru;
    return {
        _driver: 'INMEMORY_LRU',
        _initStorage(options) {
            lru = createLruCache(options.size, ttl);
        },
        async getItem(key, callback) {
            try {
                await nextTick();
                const value = lru.get(key);
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async setItem(key, value, callback) {
            try {
                await nextTick();
                lru.set(key, value);
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async removeItem(key, callback) {
            try {
                await nextTick();
                lru.delete(key);
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                callback(err);
                throw err;
            }
        },
        async clear(callback) {
            try {
                await nextTick();
                lru.clear();
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async length(callback) {
            try {
                await nextTick();
                const value = lru.size;
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async key(n, callback) {
            try {
                await nextTick();
                const value = lru.keys()[n];
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async keys(callback) {
            try {
                await nextTick();
                const value = lru.keys();
                if (callback) {
                    callback(null, value);
                }
                return value;
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
        async iterate(iteratee, callback) {
            try {
                await nextTick();
                lru.keys().forEach((key, i) => {
                    iteratee(lru.get(key), key, i);
                });
                if (callback) {
                    callback(null);
                }
            }
            catch (err) {
                if (callback) {
                    callback(err);
                }
                throw err;
            }
        },
    };
}
