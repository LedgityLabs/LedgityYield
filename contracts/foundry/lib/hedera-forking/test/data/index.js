// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { readdirSync, readFileSync } = require('fs');

module.exports = {
    /**
     * Tokens mock data loaded from `test/data/`.
     * The keys of this object are the token account IDs, _i.e._, `shardNum.realmNum.accountId`,
     * for example `0.0.429274`.
     * The EVM `address` is then computed by converting the `accountId` to its hexadecimal representation
     * (and padding accordingly).
     *
     * Each folder under `test/data/` represents a token identified by its symbol.
     * In turn, each token folder should contain a `getToken.json` that matches the response from `GET /api/v1/tokens/{tokenId}`.
     */
    tokens: (function (/**@type {{[tokenId: string]: {symbol: string, address: string}}}*/ tokens) {
        const tokensMockPath = __dirname;
        for (const symbol of readdirSync(tokensMockPath)) {
            if (symbol.endsWith('.json') || symbol.endsWith('.js')) continue;
            const { token_id } = JSON.parse(
                readFileSync(`${tokensMockPath}/${symbol}/getToken.json`, 'utf8')
            );
            assert(typeof token_id === 'string');

            const [_shardNum, _realmNum, accountId] = token_id.split('.');
            assert(accountId !== undefined);

            const address = '0x' + parseInt(accountId).toString(16).padStart(40, '0');
            tokens[token_id] = { symbol, address };
        }
        return tokens;
    })({}),
};
