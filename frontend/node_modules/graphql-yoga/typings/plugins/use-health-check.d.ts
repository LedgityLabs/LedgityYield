import { YogaLogger } from '@graphql-yoga/logger';
import { Plugin } from './types.js';
export interface HealthCheckPluginOptions {
    id?: string;
    logger?: YogaLogger;
    endpoint?: string;
}
export declare function useHealthCheck({ id, logger, endpoint, }?: HealthCheckPluginOptions): Plugin;
