import { PromiseOrValue } from '@envelop/core';
import { FetchAPI } from '../types.cjs';
import type { Plugin } from './types.cjs';
export interface LandingPageRendererOpts {
    request: Request;
    fetchAPI: FetchAPI;
    url: URL;
    graphqlEndpoint: string;
    urlPattern: InstanceType<FetchAPI['URLPattern']>;
}
export type LandingPageRenderer = (opts: LandingPageRendererOpts) => PromiseOrValue<Response>;
export declare const defaultRenderLandingPage: LandingPageRenderer;
export declare function useUnhandledRoute(args: {
    graphqlEndpoint: string;
    landingPageRenderer?: LandingPageRenderer;
    showLandingPage: boolean;
}): Plugin;
