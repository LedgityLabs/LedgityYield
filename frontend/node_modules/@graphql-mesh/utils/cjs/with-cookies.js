"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCookies = void 0;
// withCookies - embeds cookies object into the request
const withCookies = (request) => {
    request.cookies = {};
    try {
        request.cookies = (request.headers.get('Cookie') || '')
            .split(/;\s*/)
            .map(pair => pair.split(/=(.+)/))
            .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    }
    catch (err) { }
};
exports.withCookies = withCookies;
