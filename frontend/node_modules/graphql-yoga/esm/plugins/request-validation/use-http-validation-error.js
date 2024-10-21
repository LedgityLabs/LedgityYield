export function useHTTPValidationError() {
    return {
        onValidate() {
            return ({ valid, result }) => {
                if (!valid) {
                    for (const error of result) {
                        error.extensions.http = {
                            ...error.extensions.http,
                            spec: error.extensions.http?.spec ?? true,
                            status: error.extensions.http?.status ?? 400,
                        };
                    }
                }
            };
        },
    };
}
