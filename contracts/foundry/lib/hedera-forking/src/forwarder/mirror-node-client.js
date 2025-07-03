// SPDX-License-Identifier: Apache-2.0

const debug = require('util').debuglog('hedera-forking-mirror');

/**
 *
 */
const DEBUG_DISABLE_BALANCE_BLOCKNUMBER = !!process.env['DEBUG_DISABLE_BALANCE_BLOCKNUMBER'];

/** @import { IMirrorNodeClient } from '@hashgraph/system-contracts-forking' */

/**
 * Client to retrieve token and account data from the Hedera Mirror Node.
 *
 * It uses native [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
 * to make requests to the Mirror Node.
 *
 * This client only provides read-only methods, given it is only intended to retrieve data.
 *
 * @implements {IMirrorNodeClient}
 */
class MirrorNodeClient {
    /** @type {{[query: string]: unknown}} */
    _responses = {};

    /**
     * Creates a new instance of the `MirrorNodeClient` pointing to `mirrorNodeUrl`.
     *
     * @param {string} mirrorNodeUrl The base URL of the Hedera Mirror Node API.
     */
    constructor(mirrorNodeUrl) {
        this.mirrorNodeUrl = mirrorNodeUrl;
    }

    /**
     * Fetches information about a token by its token ID.
     *
     * @param {string} tokenId the token ID to fetch.
     * @param {number} blockNumber
     * @returns {Promise<Record<string, unknown> | null>} a `Promise` resolving to the token information or null if not found.
     */
    async getTokenById(tokenId, blockNumber) {
        const timestamp = await this.getBlockQueryParam(blockNumber);
        return this._get(`tokens/${tokenId}?${timestamp}`);
    }

    /**
     * Fetches information about an NFT by its token ID and serial ID.
     *
     * @param {string} tokenId the token ID to fetch.
     * @param {number} serialId the serial ID of the NFT to fetch.
     * @param {number} _blockNumber
     * @returns {Promise<Record<string, unknown> | null>} a `Promise` resolving to the token information or null if not found.
     */
    async getNftByTokenIdAndSerial(tokenId, serialId, _blockNumber) {
        return this._get(`tokens/${tokenId}/nfts/${serialId}`);
    }

    /**
     * Get token relationship for an account.
     *
     * @param {string} idOrAliasOrEvmAddress The ID or alias or EVM address of the account
     * @param {string} tokenId The ID of the token to return information for
     */
    async getTokenRelationship(idOrAliasOrEvmAddress, tokenId) {
        return this._get(`accounts/${idOrAliasOrEvmAddress}/tokens?token.id=${tokenId}`);
    }

    /**
     * Fetches the balance of a token for a specific account.
     *
     * @param {string} tokenId the token ID to fetch the balance for.
     * @param {string} accountId the account ID to fetch the balance for.
     * @param {number} blockNumber
     * @returns {Promise<{ balances: { balance: number }[] } | null>} A `Promise` resolving to the account's token balance.
     */
    async getBalanceOfToken(tokenId, accountId, blockNumber) {
        const timestamp = DEBUG_DISABLE_BALANCE_BLOCKNUMBER
            ? ''
            : `&${await this.getBlockQueryParam(blockNumber)}`;
        return this._get(`tokens/${tokenId}/balances?account.id=${accountId}${timestamp}`);
    }

    /**
     * Fetches token allowances for a specific account, token, and spender.
     *
     * @param {string} accountId The owner's account ID.
     * @param {string} tokenId The token ID.
     * @param {string} spenderId The spender's account ID.
     * @returns {Promise<{ allowances: { amount: number }[] } | null>} A `Promise` resolving to the token allowances.
     */
    getAllowanceForToken(accountId, tokenId, spenderId) {
        return this._get(
            `accounts/${accountId}/allowances/tokens?token.id=${tokenId}&spender.id=${spenderId}`
        );
    }

    /**
     * Fetches token allowances for a specific account, token, and operator.
     *
     * @param {string} accountId The owner's account ID.
     * @param {string} tokenId The token ID.
     * @param {string} operatorId The operator's account ID.
     * @returns {Promise<{ allowances: { approved_for_all: boolean }[] } | null>} A `Promise` resolving to the approval.
     */
    getAllowanceForNFT(accountId, tokenId, operatorId) {
        return this._get(
            `accounts/${accountId}/allowances/nfts?token.id=${tokenId}&account.id=${operatorId}`
        );
    }

    /**
     * Fetches account information by account ID, alias, or EVM address.
     *
     * @param {string} idOrAliasOrEvmAddress The account ID, alias, or EVM address to fetch.
     * @param {number} blockNumber
     * @returns {Promise<{ account: string, evm_address: string } | null>} A `Promise` resolving to the account information or `null` if not found.
     */
    async getAccount(idOrAliasOrEvmAddress, blockNumber) {
        const timestamp = await this.getBlockQueryParam(blockNumber);
        return this._get(`accounts/${idOrAliasOrEvmAddress}?transactions=false&${timestamp}`);
    }

    /**
     * @param {number} blockNumber
     * @returns {Promise<{timestamp: {to: string}} | null>}
     */
    getBlock(blockNumber) {
        return this._get(`blocks/${blockNumber}`);
    }

    /**
     * @param {number} blockNumber
     * @returns {Promise<string>}
     */
    async getBlockQueryParam(blockNumber) {
        const block = await this.getBlock(blockNumber);
        return `timestamp=${block?.timestamp.to}`;
    }

    /**
     * Sends a `GET` request to the specified Mirror Node URL and returns the response data.
     *
     * @private
     * @template T
     * @param {string} request The endpoint to send the `GET` request to.
     * @returns {Promise<T | null>} A `Promise` resolving to the response data or `null` if an error happened.
     */
    async _get(request) {
        const url = `${this.mirrorNodeUrl}${request}`;

        if (this._responses[url] !== undefined) {
            debug('Cached response for', url);
            return /**@type{T}*/ (this._responses[url]);
        }

        try {
            debug('Mirror Node request', url);
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    this._responses[url] = null;
                    return null;
                }
                throw new Error(
                    `Request failed with status ${response.status}: ${response.statusText}`
                );
            }
            const result = await response.json();
            this._responses[url] = result;
            return result;
        } catch (err) {
            console.error(`Error fetching data from ${request}`);
            console.error(err);
            return null;
        }
    }
}

module.exports = { MirrorNodeClient };
