/* eslint-disable @typescript-eslint/ban-types */
import { LRUCache as LRU } from 'lru-cache';
const DEFAULT_MAX = 1024;
const DEFAULT_TTL = 3_600_000;
export function createLRUCache({ max = DEFAULT_MAX, ttl = DEFAULT_TTL, } = {}) {
    return new LRU({ max, ttl });
}
