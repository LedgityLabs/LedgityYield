// SPDX-License-Identifier: Apache-2.0

/**
 *
 */
interface IMirrorNodeClient {
    /**
     * Get token by id.
     *
     * Returns token entity information given the id.
     *
     * This method should call the Mirror Node API endpoint `GET /api/v1/tokens/{tokenId}`.
     *
     * @param tokenId The ID of the token to return information for.
     * @param blockNumber
     */
    getTokenById(tokenId: string, blockNumber: number): Promise<Record<string, unknown> | null>;

    /**
     * Get NFT by token id and serial id.
     *
     * Returns token NFT entity information given the token id and serial id.
     *
     * This method should call the Mirror Node API endpoint `GET /api/v1/tokens/{tokenId}/nft/{serialId}`.
     *
     * @param tokenId The ID of the token to return information for.
     * @param serialId The serial id of the NFT.
     * @param blockNumber
     */
    getNftByTokenIdAndSerial(
        tokenId: string,
        serialId: number,
        blockNumber: number
    ): Promise<Record<string, unknown> | null>;

    /**
     * Get token relationship for an account.
     *
     * This method should call the Mirror Node API endpoint: `GET /api/v1/accounts/{idOrAliasOrEvmAddress}/tokens`.
     *
     * @param idOrAliasOrEvmAddress The ID or alias or EVM address of the account
     * @param tokenId The ID of the token to return information for
     */
    getTokenRelationship(
        idOrAliasOrEvmAddress: string,
        tokenId: string
    ): Promise<{
        tokens: {
            token_id: string;
            automatic_association: boolean;
        }[];
    } | null>;

    /**
     * Get token balance of `accountId`.
     *
     * This represents the Token supply distribution across the network.
     *
     * This method should call the Mirror Node API endpoint `GET /api/v1/tokens/{tokenId}/balances`.
     *
     * @param tokenId The ID of the token to return information for.
     * @param accountId The ID of the account to return information for.
     * @param blockNumber
     */
    getBalanceOfToken(
        tokenId: string,
        accountId: string,
        blockNumber: number
    ): Promise<{
        balances: {
            balance: number;
        }[];
    } | null>;

    /**
     * Returns information for fungible token allowances for an account.
     *
     * NOTE: `blockNumber` is not yet included until we fix issue
     * https://github.com/hashgraph/hedera-forking/issues/89.
     *
     * @param accountId Account alias or account id or evm address.
     * @param tokenId The ID of the token to return information for.
     * @param spenderId The ID of the spender to return information for.
     */
    getAllowanceForToken(
        accountId: string,
        tokenId: string,
        spenderId: string
    ): Promise<{
        allowances: {
            amount: number;
        }[];
    } | null>;

    /**
     * Returns information for non-fungible token allowances for an account.
     *
     * NOTE: `blockNumber` is not yet included until we fix issue
     * https://github.com/hashgraph/hedera-forking/issues/89.
     *
     * @param accountId Account alias or account id or evm address.
     * @param tokenId The ID of the token to return information for.
     * @param operatorId The ID of the operator to return information for.
     */
    getAllowanceForNFT(
        accountId: string,
        tokenId: string,
        operatorId: string
    ): Promise<{
        allowances: {
            approved_for_all: boolean;
        }[];
    } | null>;

    /**
     * Get account by alias, id, or evm address.
     *
     * Return the account transactions and balance information given an account alias, an account id, or an evm address.
     * The information will be limited to at most 1000 token balances for the account as outlined in HIP-367.
     * When the timestamp parameter is supplied, we will return transactions and account state for the relevant timestamp query.
     * Balance information will be accurate to within 15 minutes of the provided timestamp query.
     * Historical ethereum nonce information is currently not available and may not be the exact value at a provided timestamp.
     *
     * This method should call the Mirror Node API endpoint `GET /api/v1/accounts/{idOrAliasOrEvmAddress}`.
     *
     * @param idOrAliasOrEvmAddress
     * @param blockNumber
     */
    getAccount(
        idOrAliasOrEvmAddress: string,
        blockNumber: number
    ): Promise<{
        account: string;
        evm_address: string;
    } | null>;
}

/**
 * The HTS System Contract is exposed via the
 * [`0x0000000000000000000000000000000000000167` address](https://github.com/hashgraph/hedera-smart-contracts?tab=readme-ov-file#hedera-token-service-hts-system-contract).
 */
export const HTSAddress: string;

/**
 * The prefix that token addresses must match in order to perform token lookup.
 */
export const LONG_ZERO_PREFIX: string;

/**
 * List of token addresses created locally.
 * The `eth_getCode` for a token created locally should return the proxy bytecode.
 */
export const localTokens: string[];

/**
 * Sets the `ledgerId` used when retrieving fungible and non-fungible tokens.
 *
 * The `ledgerId` depends on the `chainId` of the remote network it is forking from.
 *
 * This mapping is as follows:
 *   - 295: 0x00 (mainnet)
 *   - 296: 0x01 (testnet)
 *   - 297: 0x02 (previewnet)
 *   - 298: 0x03 (local node)
 *
 * @param chainId Chain id used to determine the corresponding ledger id.
 */
export function setLedgerId(chainId?: number);

/**
 * Returns the token proxy contract bytecode for the given `address`.
 * Based on the proxy contract defined by [HIP-719](https://hips.hedera.com/hip/hip-719).
 *
 * For reference, you can see the
 * [`hedera-services`](https://github.com/hashgraph/hedera-services/blob/fbac99e75c27bf9c70ebc78c5de94a9109ab1851/hedera-node/hedera-smart-contract-service-impl/src/main/java/com/hedera/node/app/service/contract/impl/state/DispatchingEvmFrameState.java#L96)
 * implementation.
 *
 * The **template** bytecode can also be obtained using the `eth_getCode` JSON-RPC method with an HTS token.
 * For example,
 * to get the proxy bytecode for `USDC` on _mainnet_ https://hashscan.io/mainnet/token/0.0.456858,
 * we can use
 *
 * ```sh
 * cast code --rpc-url https://mainnet.hashio.io/api 0x000000000000000000000000000000000006f89a
 * ```
 *
 * @param {string} address The token contract `address` to replace.
 * @returns {string} The bytecode for token proxy contract with the replaced `address`.
 */
export function getHIP719Code(address: string): string;

/**
 * Gets the runtime bytecode for the Solidity implementation of the HTS System Contract.
 *
 * This bytecode is meant to be deployed at address `0x167`.
 */
export function getHtsCode(): string;

/**
 * Allows the user to query the state of an HTS Token as if it were a standard smart contract.
 *
 * This function should not throw, provided the `mirrorNodeClient` does not throw either.
 * If the `mirrorNodeClient` throws, _e.g._, due to connection issues,
 * error should be handled by the caller.
 *
 * When the token ID corresponding to `address` does not exist,
 * the respective calls on `mirrorNodeClient` should return `null`.
 *
 * The storage mechanism for _"dynamic"_ slots, _e.g._, `balanceOf` or `allowance`, use a map between addresses and account IDs.
 * This allow the contract to reduce the space to marshal an account:
 * `32 bits` (or even `64 bits` if longer IDs are needed) using `accountid` (omitting the `shardId` and `realmId`) against `160 bits` using `address`.
 * This mechanism in turn allow us to marshal more than one account used in storage slots, _e.g._, `allowance`.
 *
 * @param address can be either a Token address or the HTS address (`0x167`).
 * @param slot corresponds to the slots defined by the Storage Layout of `HtsSystemContract` or a _"dynamic"_ slot.
 * @param blockNumber specifies the point in time to fetch the requested `slot` from the Mirror Node.
 * @param mirrorNodeClient the client used to fetch Token data from the Mirror Node.
 */
export function getHtsStorageAt(
    address: string,
    slot: string,
    blockNumber: number,
    mirrorNodeClient: IMirrorNodeClient
): Promise<string | null>;
