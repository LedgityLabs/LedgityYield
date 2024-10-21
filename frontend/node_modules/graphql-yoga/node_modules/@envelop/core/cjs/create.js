"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envelop = void 0;
const orchestrator_js_1 = require("./orchestrator.js");
function notEmpty(value) {
    return value != null;
}
function envelop(options) {
    const plugins = options.plugins.filter(notEmpty);
    const orchestrator = (0, orchestrator_js_1.createEnvelopOrchestrator)({
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
exports.envelop = envelop;
