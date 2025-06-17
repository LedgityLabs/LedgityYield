// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const debug = require('util').debuglog('hts-forking');

const { ZERO_HEX_32_BYTE, toIntHex256 } = require('./utils');
const { slotMapOf, packValues, PersistentStorageMap, setLedgerId } = require('./slotmap');
const { deployedBytecode } = require('../out/HtsSystemContract.sol/HtsSystemContract.json');

const HTSAddress = '0x0000000000000000000000000000000000000167';

const LONG_ZERO_PREFIX = '0x000000000000';

function getHIP719Code(/** @type {string} */ address) {
    const PLACEHOLDER = 'fefefefefefefefefefefefefefefefefefefefe';
    assert(/^0[xX][0-9a-fA-F]{40}$/.test(address), 'Address must be a valid EVM address');
    return require('./HIP719.bytecode.json').replace(PLACEHOLDER, address.slice(2));
}

function getHtsCode() {
    return deployedBytecode.object;
}

/**
 * Slot map of tokens, but persistent, will not be removed between multiple separate requests.
 */
const persistentStorage = new PersistentStorageMap();

/**
 * List of token addresses created locally.
 * The `eth_getCode` for a token created locally should return the proxy bytecode.
 *
 * @type {string[]}
 */
const localTokens = [];

/**
 * @param {string} address
 * @param {string} requestedSlot
 * @param {number} blockNumber
 * @param {import('.').IMirrorNodeClient} mirrorNodeClient
 * @returns {Promise<string | null>}
 */
async function getHtsStorageAt(address, requestedSlot, blockNumber, mirrorNodeClient) {
    /** Logs `msg` and `return`s the provided `value`.
     *
     * @param {string|null} value
     * @param {string} msg
     * @returns {string|null}
     */
    const ret = (value, msg) => (debug(`${msg}, returning \`${value}\``), value);

    if (!address.startsWith(LONG_ZERO_PREFIX))
        return ret(null, `${address} does not start with \`${LONG_ZERO_PREFIX}\``);

    const nrequestedSlot = BigInt(requestedSlot);

    if (address === HTSAddress) {
        // Encoded `address(0x167).deployHIP719Proxy(address)` slot
        // slot(256) = `deployHIP719Proxy`selector(32) + padding(64) + address(160)
        if (nrequestedSlot >> 160n === 0x400f4ef3_0000_0000_0000_0000n) {
            const tokenAddress = '0x' + requestedSlot.slice(-40);
            localTokens.push(tokenAddress);
            return ret(ZERO_HEX_32_BYTE, `Create token request for address ${tokenAddress}`);
        }

        // Encoded `address(0x167).getAccountId(address)` slot
        // slot(256) = `getAccountId`selector(32) + padding(64) + address(160)
        if (nrequestedSlot >> 160n === 0xe0b490f7_0000_0000_0000_0000n) {
            const encodedAddress = requestedSlot.slice(-40);
            const account = await mirrorNodeClient.getAccount(encodedAddress, blockNumber);
            if (account === null)
                return ret(
                    `0x${requestedSlot.slice(-8).padStart(64, '0')}`,
                    `Requested address to account id, but address \`${encodedAddress}\` not found, use suffix as slot`
                );

            const [shardNum, realmNum, accountNum] = account.account.split('.');
            if (shardNum !== '0')
                return ret(ZERO_HEX_32_BYTE, `shardNum in \`${account.account}\` is not zero`);
            if (realmNum !== '0')
                return ret(ZERO_HEX_32_BYTE, `realmNum in \`${account.account}\` is not zero`);
            return ret(`0x01${toIntHex256(accountNum).slice(2)}`, 'address to accountNum');
        }

        return ret(ZERO_HEX_32_BYTE, `Requested slot for 0x167 matches field, not found`);
    }

    const tokenId = `0.0.${parseInt(address, 16)}`;
    debug(`Getting storage for \`${address}\` (tokenId=${tokenId}) at slot=${requestedSlot}`);

    // Encoded `address(tokenId).balanceOf(address)` slot
    // slot(256) = `balanceOf`selector(32) + padding(192) + accountId(32)
    if (
        nrequestedSlot >> 32n ===
        0x70a08231_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n
    ) {
        const accountId = `0.0.${parseInt(requestedSlot.slice(-8), 16)}`;
        const { balances } = (await mirrorNodeClient.getBalanceOfToken(
            tokenId,
            accountId,
            blockNumber
        )) ?? { balances: [] };
        if (balances.length === 0) return ret(ZERO_HEX_32_BYTE, 'Balance not found');

        const value = balances[0].balance;
        return ret(`0x${value.toString(16).padStart(64, '0')}`, `${tokenId} balance ${accountId}`);
    }

    // Encoded `address(tokenId).allowance(owner, spender)` slot
    // slot(256) = `allowance`selector(32) + padding(160) + spenderId(32) + ownerId(32)
    if (nrequestedSlot >> 64n === 0xdd62ed3e_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n) {
        const ownerId = `0.0.${parseInt(requestedSlot.slice(-8), 16)}`;
        const spenderId = `0.0.${parseInt(requestedSlot.slice(-16, -8), 16)}`;
        const { allowances } = (await mirrorNodeClient.getAllowanceForToken(
            ownerId,
            tokenId,
            spenderId
        )) ?? { allowances: [] };

        if (allowances.length === 0)
            return ret(ZERO_HEX_32_BYTE, `${tokenId}.allowance(${ownerId},${spenderId}) not found`);
        const value = allowances[0].amount;
        return ret(
            `0x${value.toString(16).padStart(64, '0')}`,
            `Requested slot matches ${tokenId}.allowance(${ownerId},${spenderId})`
        );
    }

    // Encoded `address(tokenId).isAssociated()` slot
    // slot(256) = `isAssociated`selector(32) + padding(192) + accountId(32)
    if (
        nrequestedSlot >> 32n ===
        0x4d8fdd6d_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n
    ) {
        const accountId = `0.0.${parseInt(requestedSlot.slice(-8), 16)}`;
        const { tokens } = (await mirrorNodeClient.getTokenRelationship(accountId, tokenId)) ?? {
            tokens: [],
        };
        if (tokens?.length > 0) {
            return ret(`0x${toIntHex256(1)}`, `Token ${tokenId} is associated with ${accountId}`);
        }
        return ret(ZERO_HEX_32_BYTE, `Token ${tokenId} not associated with ${accountId}`);
    }

    // Encoded `address(tokenId).getApproved(serialId)` slot
    // slot(256) = `getApproved`selector(32) + padding(192) + serialId(32)
    if (
        nrequestedSlot >> 32n ===
        0x81812fc_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n
    ) {
        const serialId = parseInt(requestedSlot.slice(-8), 16);
        const { spender } =
            (await mirrorNodeClient.getNftByTokenIdAndSerial(tokenId, serialId, blockNumber)) ?? {};
        if (typeof spender !== 'string')
            return ret(
                ZERO_HEX_32_BYTE,
                `NFT ${tokenId}#${serialId} is not approved to any address`
            );
        const account = await mirrorNodeClient.getAccount(spender, blockNumber);
        if (account === null)
            return ret(
                ZERO_HEX_32_BYTE,
                `NFT ${tokenId}#${serialId} is approved to address \`${spender}\`, failed to get its EVM Alias`
            );

        return ret(
            account.evm_address,
            `NFT ${tokenId}#${serialId} is approved to ${account.evm_address}`
        );
    }

    // Encoded `address(tokenId).ownerOf(serialId)` slot
    // slot(256) = `ownerOf`selector(32) + padding(192) + serialId(32)
    if (
        nrequestedSlot >> 32n ===
        0x6352211e_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n
    ) {
        const serialId = parseInt(requestedSlot.slice(-8), 16);
        const nft = (await mirrorNodeClient.getNftByTokenIdAndSerial(
            tokenId,
            serialId,
            blockNumber
        )) ?? {
            account_id: null,
        };
        if (typeof nft['account_id'] !== 'string')
            return ret(
                ZERO_HEX_32_BYTE,
                `Failed to determine an owner of the NFT ${tokenId}#${serialId}`
            );
        const account = await mirrorNodeClient.getAccount(`${nft['account_id']}`, blockNumber);
        if (account === null)
            return ret(
                ZERO_HEX_32_BYTE,
                `NFT ${tokenId}#${serialId} belongs to \`${nft['account_id']}\`, failed to get its EVM Alias`
            );

        return ret(
            account.evm_address,
            `NFT ${tokenId}#${serialId} is approved to ${account.evm_address}`
        );
    }

    // Encoded `address(tokenId).isApprovedForAll(owner, operator)` slot
    // slot(256) = `isApprovedForAll`selector(32) + padding(160) + ownerId(32) + operatorId(32)
    if (nrequestedSlot >> 64n === 0xe985e9c5_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n) {
        const operatorId = `0.0.${parseInt(requestedSlot.slice(-8), 16)}`;
        const ownerId = `0.0.${parseInt(requestedSlot.slice(-16, -8), 16)}`;
        const { allowances } = (await mirrorNodeClient.getAllowanceForNFT(
            ownerId,
            tokenId,
            operatorId
        )) ?? { allowances: [] };

        if (allowances.length === 0)
            return ret(
                ZERO_HEX_32_BYTE,
                `${tokenId}.isApprovedForAll(${ownerId},${operatorId}) not found`
            );
        const value = allowances[0].approved_for_all ? 1 : 0;
        return ret(
            `0x${value.toString(16).padStart(64, '0')}`,
            `Requested slot matches ${tokenId}.isApprovedForAll(${ownerId},${operatorId})`
        );
    }

    // Encoded `address(tokenId).tokenURI(serialId)` slot
    // slot(256) = `tokenURI`selector(32) + padding(192) + serialId(32)
    if (
        nrequestedSlot >> 32n ===
        0xc87b56dd_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000_0000n
    ) {
        const serialId = parseInt(requestedSlot.slice(-8), 16);
        const { metadata } = (await mirrorNodeClient.getNftByTokenIdAndSerial(
            tokenId,
            serialId,
            blockNumber
        )) ?? {
            metadata: null,
        };
        if (typeof metadata !== 'string')
            return ret(
                ZERO_HEX_32_BYTE,
                `Failed to get the metadata of the NFT ${tokenId}#${serialId}`
            );
        persistentStorage.store(tokenId, blockNumber, nrequestedSlot, atob(metadata));
    }
    let unresolvedValues = persistentStorage.load(tokenId, blockNumber, nrequestedSlot);
    if (unresolvedValues === undefined) {
        const token = await mirrorNodeClient.getTokenById(tokenId, blockNumber);
        if (token === null) return ret(ZERO_HEX_32_BYTE, `Token \`${tokenId}\` not found`);
        unresolvedValues = slotMapOf(token).load(nrequestedSlot);

        if (unresolvedValues === undefined)
            return ret(ZERO_HEX_32_BYTE, `Requested slot does not match any field slots`);
    }
    const values = await Promise.all(
        unresolvedValues.map(async ({ offset, path, value }) => ({
            offset,
            path,
            value: typeof value === 'function' ? await value(mirrorNodeClient, blockNumber) : value,
        }))
    );
    return ret(`0x${packValues(values)}`, `Slot matches ${values.map(v => v.path).join('|')}`);
}

module.exports = {
    HTSAddress,
    LONG_ZERO_PREFIX,
    localTokens,
    getHIP719Code,
    getHtsCode,
    getHtsStorageAt,
    setLedgerId,
};
