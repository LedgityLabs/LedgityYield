// SPDX-License-Identifier: Apache-2.0

const { strict: assert } = require('assert');
const { keccak256 } = require('ethers');

const { toIntHex256, toSnakeCase } = require('./utils');
const {
    storageLayout: { storage, types },
} = require('../out/HtsSystemContract.sol/HtsSystemContract.json');

/**
 * The `ledgerId` used when retrieving fungible and non-fungible tokens.
 */
let ledgerId = '0x00';

/**
 * @param {number=} chainId
 */
function setLedgerId(chainId) {
    const chainIdToLedgerId = { 295: '0x00', 296: '0x01', 297: '0x02', 298: '0x03' };
    ledgerId = chainIdToLedgerId[/**@type{keyof typeof chainIdToLedgerId}*/ (chainId)] ?? '0x00';
}

/**
 * Represents the value in the `SlotMap`.
 * This can be either a `string`, or a function that returns a `string`.
 * The latter was introduced to support "lazy-loading" of values that
 * may require additional calls to the Mirror Node.
 *
 * See for example how `t_address` is converted in `_types`.
 *
 * @typedef {string | ((mirrorNode: Pick<import('.').IMirrorNodeClient, 'getAccount'>, blockNumber: number) => Promise<string>)} Value
 */

/**
 * Wrapper around a `Map` that holds the slot values for a given token.
 */
class SlotMap {
    constructor() {
        /** @type {Map<bigint, {offset: number, value: Value, path: string, type: string}[]>} */
        this._map = new Map();
    }

    /**
     * Sets `value` into `slot`.
     *
     * The slots cannot be modified,
     * so reassigning an already existing slot will throw an error.
     *
     * @param {bigint} slot
     * @param {number|null} offset
     * @param {Value} value
     * @param {string} path
     * @param {string} type
     */
    store(slot, offset, value, path, type) {
        let values = this._map.get(slot);
        if (offset === null) {
            if (values !== undefined)
                throw new Error(`Slot ${slot} used by ${JSON.stringify(values)}: ${value}@${path}`);
            this._map.set(slot, [{ offset: 0, value, path, type }]);
        } else {
            if (values === undefined) {
                values = [];
                this._map.set(slot, values);
            } else {
                if (values.find(val => val.offset === offset) !== undefined) {
                    throw new Error(`Slot ${slot}:${offset} used by ${JSON.stringify(values)}`);
                }
            }
            values.push({ offset, value, path, type });
        }
    }

    /**
     * @param {bigint} slot
     */
    load(slot) {
        return this._map.get(slot);
    }
}

/**
 * Packs values into a single slot shifting according to their offsets.
 *
 * @param {{offset: number, value: string}[]} values
 * @returns {string}
 */
function packValues(values) {
    assert(values.length > 0, 'values must not be empty');

    let data = 0n;
    for (const { offset, value } of values) {
        const shifted = BigInt(`0x${value}`) << BigInt(offset * 8);
        data = data | shifted;
    }
    return toIntHex256(data);
}

/**
 * Table to convert Solidity primitive types into slot values.
 *
 * For types that may occupy more than one slot, _i.e._,
 * [`string` and `bytes`](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html#bytes-and-string),
 * a `Value[]` can be returned instead.
 * In this case, additional slot values will be stored starting from `keccak256(p)` where is `p` is the base slot.
 *
 * If a value needs to be "lazy-loaded", _e.g._, in case for `t_address`,
 * then a function that resolves to a `string` will be returned.
 * See `Value` for more details.
 *
 * @type {{[t_name: string]: (value: string) => Value[]}}
 */
const _types = {
    t_string_storage: function (str) {
        return this['t_bytes_storage'](Buffer.from(str).toString('hex'));
    },
    t_bytes_storage: hexstr => {
        const len = Buffer.from(hexstr, 'hex').length;
        const [header, lenByte, chunks] =
            len > 31
                ? [
                      '0',
                      len * 2 + 1,
                      [...Array(Math.ceil(len / 32)).keys()].map(i =>
                          hexstr.substring(i * 64, (i + 1) * 64).padEnd(64, '0')
                      ),
                  ]
                : [hexstr, len * 2, []];

        return [`${header.padEnd(64 - 2, '0')}${lenByte.toString(16).padStart(2, '0')}`, ...chunks];
    },
    t_uint8: val => [toIntHex256(val)],
    t_uint256: val => [toIntHex256(val)],
    t_int64: str => [toIntHex256(str ?? 0)],
    t_address: str => [
        str
            ? (mirrorNode, blockNumber) =>
                  mirrorNode
                      .getAccount(str, blockNumber)
                      .then(acc => toIntHex256(acc?.evm_address ?? str?.replace('0.0.', '') ?? 0))
            : toIntHex256(0),
    ],
    t_bool: value => [toIntHex256(value ? 1 : 0)],
};

/**
 * Computes the storage slots starting from the given `slot` and
 * extracts the corresponding field from `obj` and stores it into `map`.
 *
 * When a `slot` is either a `struct` or an array,
 * it will visit its members or items recursively.
 *
 * Some `struct`s may contain "gap"s in their definitions.
 * These gaps are declared only to avoid packing multiple fields in the same storage slot.
 * These "gap" fields must start with `__gap` to avoid retrieving an inexisting value.
 *
 * @param {{label: string;slot: string;type: string; offset: number;}} slot the starting slot to compute storage slots.
 * @param {bigint} baseSlot the base slot that `slot` is instantiated from.
 * @param {Record<string, unknown>} obj the current object to extract values from. It may change when visiting arrays.
 * @param {string} path represents the current `path` to extract a primitive value.
 * @param {SlotMap} map the `SlotMap` used to store the computed values. This argument will remain invariant across recursive calls.
 */
function visit(slot, baseSlot, obj, path, map) {
    const computedSlot = BigInt(slot.slot) + baseSlot;
    path += `.${slot.label}`;
    const { label, type, offset } = slot;

    const ty = types[/**@type{keyof typeof types}*/ (type)];
    if ('members' in ty) {
        ty.members.forEach(s => visit(s, computedSlot, obj, path, map));
    } else if ('base' in ty) {
        const base = ty['base'];
        const arr = obj[toSnakeCase(label)];
        assert(Array.isArray(arr));

        map.store(computedSlot, null, toIntHex256(arr.length), `${path}{len}`, type);
        const baseKeccak = BigInt(keccak256(`0x${toIntHex256(computedSlot)}`));
        const { numberOfBytes } = types[/**@type{keyof typeof types}*/ (base)];
        assert(parseInt(numberOfBytes) % 32 === 0);
        arr.forEach((item, i) =>
            visit(
                { label: '_', type: base, slot: '0', offset: 0 },
                baseKeccak + BigInt(i) * (BigInt(numberOfBytes) / 32n),
                item,
                `${path}[${i}]`,
                map
            )
        );
    } else {
        const prop = obj[toSnakeCase(label)];
        const [value, ...chunks] = _types[type](/**@type{string}*/ (prop));
        map.store(computedSlot, offset, value, path, type);

        const baseKeccak = BigInt(keccak256(`0x${toIntHex256(computedSlot)}`));
        chunks.forEach((c, i) => map.store(baseKeccak + BigInt(i), null, c, `${path}{${i}}`, type));
    }
}

/**
 * Builds the `SlotMap` for the given `token`.
 * It uses the Solidity [storage layout](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)
 * definition to build the slot map.
 *
 * It works in two phases.
 *
 * Firstly, it normalizes the `token` object.
 * This consist of
 * - normalizing some field names so that the Solidity definition matches the `token` object
 * - creating `token_keys` array to match Solidity definitions
 * - flattening top-level `structs`, _e.g._, `second`
 *
 * Secondly, it builds the actual `SlotMap` starting from the declared fields in the storage layout.
 *
 * @param {Record<string, unknown>} token
 * @returns {SlotMap}
 */
function slotMapOf(token) {
    token['token_type'] = token['type'];
    token['token_supply_type'] = token['supply_type'] === 'FINITE';
    token['default_kyc_status'] = false;
    // TODO: Decide what we will do with these hardcoded fields
    // token['contract_id'] = zeroAddress();
    // token['inherit_account_key'] = ZERO_HEX_32_BYTE;
    // token['delegatable_contract_id'] = zeroAddress();
    token['treasury'] = token['treasury_account_id'];
    token['ledger_id'] = ledgerId;
    // Every inner `struct` will be flattened by `visit`,
    // so it uses the last part of the field path, _i.e._, `.second`.
    token['second'] = `${BigInt(`${token['expiry_timestamp']}`) / 1_000_000_000n}`;
    token['pause_status'] = token['pause_status'] === 'PAUSED';
    token['token_keys'] = /**@type {const}*/ ([
        ['admin_key', 0x1],
        ['kyc_key', 0x2],
        ['freeze_key', 0x4],
        ['wipe_key', 0x8],
        ['supply_key', 0x10],
        ['fee_schedule_key', 0x20],
        ['pause_key', 0x40],
    ]).map(([prop, key_type]) => {
        const key = token[prop];
        if (key === null) return { key_type, ed25519: '', _e_c_d_s_a_secp256k1: '' };
        assert(typeof key === 'object');
        assert('_type' in key && 'key' in key);
        if (key._type === 'ED25519')
            return { key_type, ed25519: key.key, _e_c_d_s_a_secp256k1: '' };
        return { key_type, ed25519: '', _e_c_d_s_a_secp256k1: key.key };
    });
    const customFees = /**@type {Record<string, Record<string, unknown>[]>}*/ (
        token['custom_fees']
    );
    token['fixed_fees'] = (customFees['fixed_fees'] ?? []).map(fee => ({
        fee_collector: fee['collector_account_id'],
        amount: fee['amount'],
        token_id: fee['denominating_token_id'],
        use_hbars_for_payment: !fee['denominating_token_id'],
        use_current_token_for_payment: fee['denominating_token_id'] === token['token_id'],
    }));
    token['fractional_fees'] = (customFees['fractional_fees'] ?? []).map(fee => ({
        net_of_transfers: fee['net_of_transfers'],
        numerator: /**@type{{numerator: unknown}}*/ (fee['amount'])['numerator'],
        denominator: /**@type{{denominator: unknown}}*/ (fee['amount'])['denominator'],
        minimum_amount: fee['minimum'],
        maximum_amount: fee['maximum'],
        fee_collector: fee['collector_account_id'],
    }));
    token['royalty_fees'] = (customFees['royalty_fees'] ?? []).map(fee => ({
        all_collectors_are_exempt: fee['all_collectors_are_exempt'],
        numerator: /**@type{{numerator: unknown}}*/ (fee['amount'])['numerator'],
        denominator: /**@type{{denominator: unknown}}*/ (fee['amount'])['denominator'],
        collector_account_id: fee['collector_account_id'],
        amount: /**@type{{amount: unknown}}*/ (fee['fallback_fee'] || {})['amount'],
        tokenId: /**@type{{denominating_token_id: unknown}}*/ (fee['fallback_fee'] || {})[
            'denominating_token_id'
        ],
        fee_collector: fee['collector_account_id'],
    }));

    const map = new SlotMap();
    storage.forEach(slot => visit(slot, 0n, token, '', map));
    return map;
}

/**
 * Represents the value in the persistent storage.
 * Each token and `blockNumber` has its own SlotMap. Any value can be assigned to this storage
 * ad-hoc. It can be used for dynamically determined keys needed to be persistent.
 *
 * It is not possible to determine which NFT numbers have been minted unless they are specifically queried.
 * Persistent storage is used to address this issue. The current solution:
 * - Dynamically loads each NFT's details the first time its slot is queried.
 * - Once accessed, stores information about the existence of the NFT.
 *
 * Possible issues that this solution may cause. Let's consider scenario where:
 * 1. We have a long tokenUri that spans more than one storage slot.
 * 2. Someone attempts to access the value in the second slot without first querying the initial slot.
 * The correct result won't be returned then.
 * This is because persistentStorage is only populated when the request for the first slot
 * of the string is made (only then we can deduce the serial NFT number from the slot address).
 */
class PersistentStorageMap {
    constructor() {
        /** @type {Map<string, SlotMap>} */
        this._map = new Map();
    }

    /**
     * @param {string} tokenId
     * @param {number} blockNumber
     */
    _getSlotMap(tokenId, blockNumber) {
        const key = `${tokenId}:${blockNumber}`;
        let slotMap = this._map.get(key);
        if (slotMap === undefined) {
            slotMap = new SlotMap();
            this._map.set(key, slotMap);
        }
        return slotMap;
    }

    /**
     * @param {string} tokenId
     * @param {number} blockNumber
     * @param {bigint} slot
     * @param {Value} value
     */
    store(tokenId, blockNumber, slot, value) {
        visit(
            { label: 'value', slot: slot.toString(), type: 't_string_storage', offset: 0 },
            0n,
            { value },
            '',
            this._getSlotMap(tokenId, blockNumber)
        );
    }

    /**
     * @param {string} tokenId
     * @param {number} blockNumber
     * @param {bigint} slot
     *
     * @returns {{offset: number, value: Value, path: string, type: string}[]|undefined}
     */
    load(tokenId, blockNumber, slot) {
        return this._getSlotMap(tokenId, blockNumber).load(slot);
    }
}

module.exports = { packValues, slotMapOf, PersistentStorageMap, setLedgerId };
