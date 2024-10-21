import { process } from '@graphql-mesh/cross-helpers';
export function handleFatalError(e, logger) {
    logger.error(e);
    if (process.env.JEST == null) {
        process.exit(1);
    }
}
