declare global {
    interface DateConstructor {
        isFake: boolean;
    }
}
export declare function enableFakeTimers(config?: FakeTimersConfig | LegacyFakeTimersConfig): Disposable;
//# sourceMappingURL=enableFakeTimers.d.ts.map