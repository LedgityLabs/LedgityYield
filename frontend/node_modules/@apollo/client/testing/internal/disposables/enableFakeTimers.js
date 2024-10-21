import { withCleanup } from "./withCleanup.js";
export function enableFakeTimers(config) {
    if (global.Date.isFake === true) {
        // Nothing to do here, fake timers have already been set up.
        // That also means we don't want to clean that up later.
        return withCleanup({}, function () { });
    }
    jest.useFakeTimers(config);
    return withCleanup({}, function () {
        if (global.Date.isFake === true) {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        }
    });
}
//# sourceMappingURL=enableFakeTimers.js.map