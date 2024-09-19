import { observableToAsyncIterable } from '@graphql-tools/utils';
export class PubSub {
    constructor() {
        this.subIdListenerMap = new Map();
        this.listenerEventMap = new Map();
        this.eventNameListenersMap = new Map();
    }
    getEventNames() {
        return this.eventNameListenersMap.keys();
    }
    publish(triggerName, detail) {
        const eventNameListeners = this.eventNameListenersMap.get(triggerName);
        if (eventNameListeners) {
            Promise.allSettled([...eventNameListeners].map(listener => listener(detail))).catch(e => console.error(e));
        }
    }
    subscribe(triggerName, onMessage) {
        let eventNameListeners = this.eventNameListenersMap.get(triggerName);
        if (!eventNameListeners) {
            eventNameListeners = new Set();
            this.eventNameListenersMap.set(triggerName, eventNameListeners);
        }
        const subId = Date.now();
        eventNameListeners.add(onMessage);
        this.subIdListenerMap.set(subId, onMessage);
        this.listenerEventMap.set(onMessage, triggerName);
        return subId;
    }
    unsubscribe(subId) {
        const listener = this.subIdListenerMap.get(subId);
        if (listener) {
            this.subIdListenerMap.delete(subId);
            const eventName = this.listenerEventMap.get(listener);
            if (eventName) {
                const eventNameListeners = this.eventNameListenersMap.get(eventName);
                if (eventNameListeners) {
                    eventNameListeners.delete(listener);
                }
            }
        }
        this.listenerEventMap.delete(listener);
    }
    asyncIterator(triggerName) {
        return observableToAsyncIterable({
            subscribe: observer => {
                const subId = this.subscribe(triggerName, data => observer.next(data));
                return {
                    unsubscribe: () => this.unsubscribe(subId),
                };
            },
        });
    }
}
