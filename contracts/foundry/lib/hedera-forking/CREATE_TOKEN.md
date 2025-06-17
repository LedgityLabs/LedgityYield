# How Create and Delete HTS Tokens Work

Hedera Token Services provide several methods to create both Fungible and Non-Fungible Tokens.
Each method providing different capabilities for token creation.
The following is the list of methods to create tokens.

```solidity
/// Creates a Fungible Token with the specified properties
/// @param token the basic properties of the token being created
/// @param initialTotalSupply Specifies the initial supply of tokens to be put in circulation. The
/// initial supply is sent to the Treasury Account. The supply is in the lowest denomination possible.
/// @param decimals the number of decimal places a token is divisible by
/// @return responseCode The response code for the status of the request. SUCCESS is 22.
/// @return tokenAddress the created token's address
function createFungibleToken(
    HederaToken memory token,
    int64 initialTotalSupply,
    int32 decimals
) external payable returns (int64 responseCode, address tokenAddress);

/// Creates a Fungible Token with the specified properties
/// @param token the basic properties of the token being created
/// @param initialTotalSupply Specifies the initial supply of tokens to be put in circulation. The
/// initial supply is sent to the Treasury Account. The supply is in the lowest denomination possible.
/// @param decimals the number of decimal places a token is divisible by.
/// @param fixedFees list of fixed fees to apply to the token
/// @param fractionalFees list of fractional fees to apply to the token
/// @return responseCode The response code for the status of the request. SUCCESS is 22.
/// @return tokenAddress the created token's address
function createFungibleTokenWithCustomFees(
    HederaToken memory token,
    int64 initialTotalSupply,
    int32 decimals,
    FixedFee[] memory fixedFees,
    FractionalFee[] memory fractionalFees
) external payable returns (int64 responseCode, address tokenAddress);

/// Creates an Non Fungible Unique Token with the specified properties
/// @param token the basic properties of the token being created
/// @return responseCode The response code for the status of the request. SUCCESS is 22.
/// @return tokenAddress the created token's address
function createNonFungibleToken(HederaToken memory token)
    external
    payable
    returns (int64 responseCode, address tokenAddress);

/// Creates an Non Fungible Unique Token with the specified properties
/// @param token the basic properties of the token being created
/// @param fixedFees list of fixed fees to apply to the token
/// @param royaltyFees list of royalty fees to apply to the token
/// @return responseCode The response code for the status of the request. SUCCESS is 22.
/// @return tokenAddress the created token's address
function createNonFungibleTokenWithCustomFees(
    HederaToken memory token,
    FixedFee[] memory fixedFees,
    RoyaltyFee[] memory royaltyFees
) external payable returns (int64 responseCode, address tokenAddress);
```

On the other hand, the method to delete an HTS token, either Fungible or Non-Fungible is the following

```solidity
/// Operation to delete token
/// @param token The token address to be deleted
/// @return responseCode The response code for the status of the request. SUCCESS is 22.
function deleteToken(address token) external returns (int64 responseCode);
```

The main goal of this document is to describe how to enable token creation and deletion on HTS emulation.

## What about Forking from a Remote Network?

The introduction of token creation unlocks a new capability:
_Using the HTS emulation **without** forking._
In order to use HTS emulation, a token must be present in the Ethereum Development Environment network, _e.g._, Hardhat's EDR or Foundry's Anvil.
This can be done in two ways.
Fetching the token state from a remote network, or by creating a token locally altogether.

Compare this to the HTS mock present in the [Smart Contracts repo](https://github.com/hashgraph/hedera-smart-contracts/tree/main/test/foundry/mocks/hts-precompile).
In addition to providing the same features as the HTS mock, we provide forking capabilities as well.

## High-level Specification

The following auxiliary definitions are needed.
See <https://github.com/hashgraph/hedera-smart-contracts/issues/1026> for more details.

```solidity
interface IHtsFungibleToken is IERC20, IHRC719 {}
interface IHtsNonFungibleToken is IERC721, IHRC719 {}
```

### Create Token

All token creation methods receive a `token`, which refers to the `HederaToken` used to configure the initial values of the token being created.
They return a `tokenAddress`, which will be the address of the newly created token.

A successful call to any token creation method should have the following effect

- The associated bytecode of `tokenAddress` should be that of the Proxy Contract as defined by [HIP719 _&sect; Specification_](https://hips.hedera.com/hip/hip-719). Note that the `tokenAddress` should be embedded into the Proxy bytecode as noted by the HIP.
- The balance of the `token.treasury` should be `totalSupply`.
- The `token.treasury` address should be associated to the token.
- The token should not have any other balances nor associations.
- A non-fungible token should not have any minted NFT.
- An immediate call to `IHederaTokenService(0x167).getTokenInfo(tokenAddress)` should return `token`.
- All methods in either `IHtsFungibleToken(tokenAddress)` or `IHtsNonFungibleToken(tokenAddress)` should be available to invoke.

#### Token Creation Counter

HTS emulation should keep an internal counter to track the next token address to be created.

- **In forking mode,** this counter should resemble the next token address from the remote network. This can be obtained by querying the Mirror Node for the latest account and token IDs and getting the latest (higher) between these two. The latest account ID can be obtained with `/v1/accounts?order=desc&limit=1`. On the other hand, the latest token ID can be obtained with `/v1/tokens?order=desc&limit=1`.
- **In non-forking mode,** this counter should be `0.0.1032`, the first token account ID created by local node when `--createInitialResources=true` is specified.

### Delete Token

Similarly, a successful call to `deleteToken` should have the following effect

- The associated bytecode of `tokenAddress` should be `0x`.
- No calls to either `IHtsFungibleToken(tokenAddress)` or `IHtsNonFungibleToken(tokenAddress)` should be possible.

A `deleteToken` operation should leave the _Token Creation Counter_ untouched.

## Foundry library

A token create method should first check that `token` is valid, _e.g._, `token.name` is not empty.
Then a `TokenInfo` variable should be created containing `token` and the remaining creation arguments as applicable.

After that, the created `TokenInfo` should be copied into `internal _tokenInfo` of the `tokenAddress` slot space.
In order to achieve that, the Proxy bytecode is deployed at `tokenAddress` using `vm.etch`.
Then, a call into `redirectForToken` is used to copy the `TokenInfo` into the storage space of `tokenAddress`.

> [!NOTE]
>
> ~~To avoid changing the `redirectForToken` and `_initTokenData` interaction, we can deploy a temporary contract that copies `_tokenInfo` into its own storage space. After that, we deploy the Proxy Contract bytecode at `tokenAddress`.~~
>
> In a previous iteration, a temporary contract was used to copy `_tokenInfo` into the token's storage space.
> However, this did not play well using Hardhat.
> Replacing the contract bytecode from within the EVM is only possible in Hardhat when the cache is disabled.
> But disabling the cache would have a heavy performance penalty for users.
> That is why we decided to go with the single deployment approach.

## Hardhat plugin

The main issue with the Hardhat plugin is how to deploy the HIP 719 Proxy Contract into a predefined address, `tokenAddress`.
As expected, this is not possible using only vanilla EVM.
As we saw in the previous section, the Foundry library leverages Foundry cheatcode [`vm.etch`](https://book.getfoundry.sh/cheatcodes/etch) to deploy the Proxy Contract to a predefined address.
This can be done regardless of the forking environment.

However, the Hardhat plugin works in a completely different manner.
If fork is disabled, we simply cannot deploy into a predefined address as mentioned above.
We cannot use [`hardhat_setcode`](https://hardhat.org/hardhat-network/docs/reference#hardhat_setcode) either.
This is because there is no way to hook into EVM internal calls (the same reason we had to introduce the JSON-RPC Forwarder in the first place).

A possible solution could be to use the JSON-RPC Forwarder with no backend Mirror Node.
Then we can introduce a dummy slot for `eth_getStorageAt` that signals the creation of a token (see [_&sect; Token Creation Counter_](#token-creation-counter)).
The JSON-RPC Forwarder can then return the Proxy Contract bytecode when a request `eth_getCode(tokenAddress)` is performed.

This means that even if the user selects a non-forking environment,
Hardhat will run in a forked one, against a no-backend JSON-RPC Forwarder.
