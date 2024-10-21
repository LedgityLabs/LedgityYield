import { LRUCache as LRU } from 'lru-cache';
export type LRUCache<T extends {}> = LRU<string, T>;
export interface LRUCacheOptions {
    max?: number;
    ttl?: number;
}
export declare function createLRUCache<T extends {}>({ max, ttl, }?: LRUCacheOptions): LRU<string, T, unknown>;
