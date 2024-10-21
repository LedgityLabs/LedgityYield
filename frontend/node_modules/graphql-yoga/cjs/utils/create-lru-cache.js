"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLRUCache = createLRUCache;
/* eslint-disable @typescript-eslint/ban-types */
const lru_cache_1 = require("lru-cache");
const DEFAULT_MAX = 1024;
const DEFAULT_TTL = 3_600_000;
function createLRUCache({ max = DEFAULT_MAX, ttl = DEFAULT_TTL, } = {}) {
    return new lru_cache_1.LRUCache({ max, ttl });
}
