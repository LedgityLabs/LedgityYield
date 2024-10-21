import { makeExecutableSchema } from '@graphql-tools/schema';
// eslint-disable-next-line @typescript-eslint/ban-types
export function createSchema(opts) {
    return makeExecutableSchema(opts);
}
