export function withFilter(asyncIteratorFn, filterFn) {
    return async (rootValue, args, context, info) => {
        const asyncIterator = await asyncIteratorFn(rootValue, args, context, info);
        const getNextPromise = () => {
            return new Promise((resolve, reject) => {
                const inner = () => {
                    asyncIterator
                        .next()
                        .then(payload => {
                        if (payload.done === true) {
                            resolve(payload);
                            return;
                        }
                        Promise.resolve(filterFn(payload.value, args, context, info))
                            .catch(() => false) // We ignore errors from filter function
                            .then(filterResult => {
                            if (filterResult === true) {
                                resolve(payload);
                                return;
                            }
                            // Skip the current value and wait for the next one
                            inner();
                        })
                            .catch(() => false); // We ignore errors from filter function;
                    })
                        .catch(err => {
                        reject(err);
                    });
                };
                inner();
            });
        };
        const asyncIterator2 = {
            next() {
                return getNextPromise();
            },
            return() {
                return asyncIterator.return();
            },
            throw(error) {
                return asyncIterator.throw(error);
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
        return asyncIterator2;
    };
}
