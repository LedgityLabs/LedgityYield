import { createEnvelopOrchestrator } from './orchestrator.js';
function notEmpty(value) {
    return value != null;
}
export function envelop(options) {
    const plugins = options.plugins.filter(notEmpty);
    const orchestrator = createEnvelopOrchestrator({
        plugins,
    });
    const getEnveloped = (initialContext = {}) => {
        const typedOrchestrator = orchestrator;
        typedOrchestrator.init(initialContext);
        return {
            parse: typedOrchestrator.parse(initialContext),
            validate: typedOrchestrator.validate(initialContext),
            contextFactory: typedOrchestrator.contextFactory(initialContext),
            execute: typedOrchestrator.execute,
            subscribe: typedOrchestrator.subscribe,
            schema: typedOrchestrator.getCurrentSchema(),
        };
    };
    getEnveloped._plugins = plugins;
    return getEnveloped;
}
