<div align="center">

# Hedera Forking for System Contracts

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/hashgraph/hedera-forking/test.yml?style=flat&logo=githubactions)](https://github.com/hashgraph/hedera-forking/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/@hashgraph/system-contracts-forking?style=flat&logo=npm)](https://www.npmjs.com/package/@hashgraph/system-contracts-forking)
![NPM Downloads](https://img.shields.io/npm/dt/@hashgraph/system-contracts-forking?style=flat&logo=npm)
[![Codecov](https://img.shields.io/codecov/c/github/hashgraph/hedera-forking?style=flat&logo=codecov)](https://codecov.io/gh/hashgraph/hedera-forking)
[![License](https://img.shields.io/github/license/hashgraph/hedera-forking?style=flat)](LICENSE)
[![Discord](https://img.shields.io/badge/discord-join%20chat-blue.svg?style=flat&logo=discord)](https://hedera.com/discord)

</div>

**This project allows Smart Contract developers working on Hedera to use fork testing while using Hedera System Contracts.**
It does so by providing an emulation layer for the [Hedera Token Service](https://hedera.com/token-service) _(more System Contracts to come)_ written in Solidity.
Given it is written in Solidity, it can be executed in a forked network environment, such as
[Foundry](https://book.getfoundry.sh/forge/fork-testing) or
[Hardhat](https://hardhat.org/hardhat-network/docs/overview#mainnet-forking).

You can use either our [Foundry library](#foundry-library) or [Hardhat plugin](#hardhat-plugin) to enable HTS emulation in your project.

See [Hedera Token Service Supported Methods](#hedera-token-service-supported-methods) for a list of methods currently implemented as part of this project.

> [!IMPORTANT]
> The HTS emulation contract **SHOULD BE ONLY** used to ease development workflow when working with Hedera Tokens.
> The HTS emulation contract **DOES NOT** replicate Hedera Token Services fully.
> That is, behavior might differ when switching from local development to a real Hedera network.
> **Always test your contracts against a real Hedera network before launching your contracts.**

> For detailed information on how this project works, see [Internals](./INTERNALS.md).

> [!NOTE]
> The [FAQ](./FAQ.md) provides common issues that this project solves.

## Foundry library

We provide a Foundry library that enables fork testing when using HTS Tokens.

> To see how this library works in details, see [_Foundry library_](./INTERNALS.md#foundry-library) in Internals.

### Installation

First, install our library in your Foundry project

```console
forge install hashgraph/hedera-forking
```

#### Requirements

Ensure your project meets the following requirements

- `forge-std` [`>= v1.8.0`](https://github.com/foundry-rs/forge-std/releases/tag/v1.8.0)

### Set up

To use this library in your tests, you need to enable [`ffi`](https://book.getfoundry.sh/cheatcodes/ffi).
You can do so by adding the following lines to your `.toml` file

```toml
[profile.default]
ffi = true
```

Alternatively, you can add the `--ffi` flag to your execution script.

This is necessary because

- On Unix-like operating systems, the library relies on [`curl`](https://curl.se/) to make HTTP requests to the Hedera remote network. This allows the library to fetch token state from the remote network. Since `curl` is an external command, `ffi` must be enabled.
- On Windows, if PowerShell is available, the library uses the `Invoke-WebRequest` command to handle HTTP requests, which also requires `ffi` to be enabled.

> [!NOTE]  
> The Foundry library assumes it is running on either a Windows system with PowerShell or a Unix-like operating system.
>
> - On Unix-like systems, it uses `curl`, `bash`, `tail`, `sed`, and `tr` to make requests and parse responses.
> - On Windows, it uses `Invoke-WebRequest` and `Start-Process` in PowerShell for a similar effect.

To activate HTS emulation in your tests, you need to add the following setup code in your test files.
Import our System Contracts `library` to deploy HTS emulation and enable cheat codes for it.

```solidity
import {Hsc} from "hedera-forking/Hsc.sol";
```

and then invoke it in your [test setup](https://book.getfoundry.sh/forge/writing-tests)

```solidity
    function setUp() public {
        Hsc.htsSetup();
    }
```

### Running your Tests

Now you can use Hedera Token Services and remote tokens as if they were deployed locally when fork testing.
For example

```solidity examples/foundry-hts/test/USDC.t.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {Hsc} from "hedera-forking/Hsc.sol";
import {IERC20} from "hedera-forking/IERC20.sol";
import {IHederaTokenService} from "hedera-forking/IHederaTokenService.sol";
import {HederaResponseCodes} from "hedera-forking/HederaResponseCodes.sol";

contract USDCExampleTest is Test {
    // https://hashscan.io/mainnet/token/0.0.456858
    address USDC_mainnet = 0x000000000000000000000000000000000006f89a;

    address private user1;

    function setUp() external {
        Hsc.htsSetup();

        user1 = makeAddr("user1");
        deal(USDC_mainnet, user1, 1000 * 10e8);
    }

    function test_get_balance_of_existing_account() view external {
        // https://hashscan.io/mainnet/account/0.0.1528
        address usdcHolder = 0x00000000000000000000000000000000000005f8;
        // Balance retrieved from mainnet at block 72433403
        assertEq(IERC20(USDC_mainnet).balanceOf(usdcHolder), 28_525_752677);
    }

    function test_dealt_balance_of_local_account() view external {
        assertEq(IERC20(USDC_mainnet).balanceOf(user1), 1000 * 10e8);
    }

    function test_HTS_getTokenInfo() external view {
        (int64 responseCode, IHederaTokenService.TokenInfo memory tokenInfo) = IHederaTokenService(address(0x167)).getTokenInfo(USDC_mainnet);
        assertEq(responseCode, HederaResponseCodes.SUCCESS);
        assertEq(tokenInfo.token.name, "USD Coin");
        assertEq(tokenInfo.token.symbol, "USDC");
        assertEq(tokenInfo.token.memo, "USDC HBAR");
    }
}
```

To run your tests, use the usual command

```console
forge test --fork-url https://mainnet.hashio.io/api
```

You can also include a specific block number.
For example, the test above is known to work at block `72433403`

```console
forge test --fork-url https://mainnet.hashio.io/api --fork-block-number 72433403
```

You can use all the tools and cheatcodes Foundry provides, _e.g._, `console.log`

```solidity examples/foundry-hts/test/USDCConsole.t.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Hsc} from "hedera-forking/Hsc.sol";
import {IERC20} from "hedera-forking/IERC20.sol";

contract USDCConsoleExampleTest is Test {
    function setUp() external {
        Hsc.htsSetup();
    }

    function test_using_console_log() view external {
        // https://hashscan.io/mainnet/token/0.0.456858
        address USDC_mainnet = 0x000000000000000000000000000000000006f89a;

        string memory name = IERC20(USDC_mainnet).name();
        string memory symbol = IERC20(USDC_mainnet).symbol();
        uint8 decimals = IERC20(USDC_mainnet).decimals();
        assertEq(name, "USD Coin");
        assertEq(symbol, "USDC");
        assertEq(decimals, 6);

        console.log("name: %s, symbol: %s, decimals: %d", name, symbol, decimals);
    }
}
```

### Running your Scripts

Foundry allows you to run Solidity Scripts to interact with a remote network using the `--broadcast` flag.
See [_Scripting with Solidity_](https://book.getfoundry.sh/guides/scripting-with-solidity) for more information on the topic.

To enable Foundry Scripts to work with HTS, you can use `htsSetup()` as described in the previous section.
For example

```solidity examples/foundry-hts/script/CreateToken.s.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {HTS_ADDRESS} from "hedera-forking/HtsSystemContract.sol";
import {IHederaTokenService} from "hedera-forking/IHederaTokenService.sol";
import {Hsc} from "hedera-forking/Hsc.sol";

/**
 * Given how Foundry script works, the flag `--skip-simulation` is necessary.
 * For example
 *
 * forge script CreateTokenScript --rpc-url testnet --broadcast --skip-simulation
 */
contract CreateTokenScript is Script {
    function run() external returns (address signer, int64 responseCode, address tokenAddress) {
        Hsc.htsSetup();

        uint256 PRIVATE_KEY = vm.envUint("PRIVATE_KEY");
        signer = vm.addr(PRIVATE_KEY);

        IHederaTokenService.KeyValue memory keyValue;
        keyValue.inheritAccountKey = true;

        IHederaTokenService.HederaToken memory token;
        token.name = "HTS Token Example Created with Foundry";
        token.symbol = "FDRY";
        token.treasury = signer;
        token.memo = "This HTS Token was created using `forge script` together with HTS emulation";
        token.tokenKeys = new IHederaTokenService.TokenKey[](2);
        token.tokenKeys[0] = IHederaTokenService.TokenKey(0x1, keyValue); // Admin Key
        token.tokenKeys[1] = IHederaTokenService.TokenKey(0x10, keyValue); // Supply Key enables minting
        token.expiry = IHederaTokenService.Expiry(0, signer, 8000000);

        vm.startBroadcast(PRIVATE_KEY);
        (responseCode, tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 10 ether}(token, 10000, 4);
        vm.stopBroadcast();
    }
}
```

where `testnet` is an [RPC endpoint](https://book.getfoundry.sh/reference/config/testing#rpc_endpoints) declared in `foundry.toml`.
For example

```toml
[rpc_endpoints]
mainnet = "https://mainnet.hashio.io/api"
testnet = "https://testnet.hashio.io/api"
previewnet = "https://previewnet.hashio.io/api"
localnode = "http://localhost:7546"
```

> [!IMPORTANT]
> Make sure to include the `--skip-simulation` flag when running `forge script`.
> Otherwise you will get [`EvmError: InvalidFEOpcode`](./FAQ.md#what-causes-the-error-evmerror-invalidfeopcode).

## Hardhat plugin

We provide a Hardhat plugin that enables fork testing when using HTS Tokens.

In addition, this plugin provides the following features

- **Sets up Hardfork history for Hedera networks.** This solves the issue
  [`No known hardfork for execution on historical block`](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#using-a-custom-hardfork-history).
- **Avoids `Missing access list` error.** Hardhat throws this error when a `blockNumber` is provided in the forking configuration. The plugin solves this issue.

This plugin intercepts the calls made by Hardhat to fetch remote state, \_i.e.,
`eth_getCode` and `eth_getStorageAt`, to provide emulation for HTS.
It assigns the Hedera Token Service code to the `0x167` address.
In your tests, you will be able to query Hedera Token data as if they were stored as regular Smart Contracts.

> To see how this plugin works in details, see [_Hardhat plugin_](./INTERNALS.md#hardhat-plugin) in Internals.

### Installation

To use this plugin, install it via your package manager.

If you are using **npm**

```console
npm install --save-dev @hashgraph/system-contracts-forking
```

or using **yarn**

```console
yarn add --dev @hashgraph/system-contracts-forking
```

### Set up

Next, add the following line to the top of your Hardhat config file, _e.g._, `hardhat.config.js`

```javascript
require('@hashgraph/system-contracts-forking/plugin');
```

or if you are using TypeScript, include the following line into your `hardhat.config.ts`

```javascript
import '@hashgraph/system-contracts-forking/plugin';
```

This will automatically create a worker thread to intercept calls to fetch remote state.
You can then proceed with writing your tests, and the plugin will allow you to query Hedera token data seamlessly.

### Configuration

By default, the plugin uses the Hedera Mirror Node based on the guessed chain ID from the currently forked network.

Two additional values needs to be set in order to activate the plugin.

- **`chainId`**. The call to `eth_chainId` of configuration parameter `hardhat.forking.url` needs to match the `chainId` configuration argument. Only chain IDs `295` (Mainnet), `296` (Testnet), and `297` (Previewnet) are supported.
- **`workerPort`**. Any free port to start the worker to intercept Hardhat calls to fetch remote state.

For example

```javascript
    networks: {
        hardhat: {
            forking: {
                url: 'https://mainnet.hashio.io/api',
                // This allows Hardhat to enable JSON-RPC's response cache.
                // Forking from a block is not fully integrated yet into HTS emulation.
                blockNumber: 70531900,
                chainId: 295,
                workerPort: 1235,
            },
        },
    },
```

> [!NOTE]
> These configuration settings cannot be set automatically by the Plugin.
> This is because the way Hardhat plugins are loaded by Hardhat.
> The main issue is _"since Hardhat needs to be loadable via `require` call, configuration must be synchronous"_.
> See [here](https://github.com/NomicFoundation/hardhat/issues/3287) and [here](https://github.com/NomicFoundation/hardhat/issues/2496) for more details.
>
> Creating a Worker so we can hook into `eth_getCode` and `eth_getStorageAt` to provide HTS emulation and querying the `chainId` of a remote network are **asynchronous** operations.
> That is why we need to shift the setting of `chainId` and `workerPort` to the user.

### Running Your Tests

For example, to query USDC information on mainnet you can use the following test

```javascript examples/hardhat-hts/test/usdc-info.test.js
// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { ethers: { getContractAt } } = require('hardhat');

describe('USDC example -- informational', function () {
    it('should get name, symbol and decimals', async function () {
        // https://hashscan.io/mainnet/token/0.0.456858
        const usdc = await getContractAt('IERC20', '0x000000000000000000000000000000000006f89a');
        expect(await usdc['name']()).to.be.equal('USD Coin');
        expect(await usdc['symbol']()).to.be.equal('USDC');
        expect(await usdc['decimals']()).to.be.equal(6n);
    });
});
```

Then run your Hardhat tests as usual

```console
npx hardhat
```

You can also query an existing account's balance.
For example using the `blockNumber` as shown above in [_Configuration_](#configuration),
you can query the USDC balance for an existing account.

```javascript examples/hardhat-hts/test/usdc-balance.test.js
// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { ethers: { getContractAt } } = require('hardhat');

describe('USDC example -- balanceOf', function () {
    it('should get `balanceOf` account holder', async function () {
        // https://hashscan.io/mainnet/token/0.0.456858
        const usdc = await getContractAt('IERC20', '0x000000000000000000000000000000000006f89a');

        // https://hashscan.io/mainnet/account/0.0.6279
        const holderAddress = '0x0000000000000000000000000000000000001887';
        expect(await usdc['balanceOf'](holderAddress)).to.be.equal(31_166_366226);
    });
});
```

You can also perform modifications in the forked network.
Let's see an example where we execute the `transfer` method from an existing account to a local Hardhat signer.
It is usually paired with [Fixtures](https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures),
so that each test can start in a known state.
Moreover, you can use the tools you are already familiar with, for example,
[`hardhat_impersonateAccount`](https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount).

```javascript examples/hardhat-hts/test/usdc-transfer.test.js
// SPDX-License-Identifier: Apache-2.0

const { expect } = require('chai');
const { ethers: { getSigner, getSigners, getContractAt }, network: { provider } } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('USDC example -- transfer', function () {
    async function id() {
        return [(await getSigners())[0]];
    }

    it("should `tranfer` tokens from account holder to one of Hardhat' signers", async function () {
        const [receiver] = await loadFixture(id);

        // https://hashscan.io/mainnet/account/0.0.6279
        const holderAddress = '0x0000000000000000000000000000000000001887';
        await provider.request({
            method: 'hardhat_impersonateAccount',
            params: [holderAddress],
        });
        const holder = await getSigner(holderAddress);

        // https://hashscan.io/mainnet/token/0.0.456858
        const usdc = await getContractAt('IERC20', '0x000000000000000000000000000000000006f89a');

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(0n);

        await usdc.connect(holder)['transfer'](receiver, 10_000_000n);

        expect(await usdc['balanceOf'](receiver.address)).to.be.equal(10_000_000n);
    });
});
```

## Hedera Token Service Supported Methods

Given your HTS token address, you can invoke these functions whether the token is either fungible or non-fungible.

### Fungible Tokens

The following methods and events are applicable to Fungible Tokens.

#### ERC20 Interface

<!-- !./scripts/abi-table.js out/IERC20.sol/IERC20.json -->

| Function                                                          | Comment                                                                                                                                                                                                              |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowance(address owner, address spender) view`                  | Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called. |
| `approve(address spender, uint256 amount)`                        | Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens. Returns a boolean value indicating whether the operation succeeded.                                                          |
| `balanceOf(address account) view`                                 | Returns the value of tokens owned by `account`.                                                                                                                                                                      |
| `decimals() view`                                                 | Returns the decimals places of the token.                                                                                                                                                                            |
| `name() view`                                                     | Returns the name of the token.                                                                                                                                                                                       |
| `symbol() view`                                                   | Returns the symbol of the token.                                                                                                                                                                                     |
| `totalSupply() view`                                              | Returns the value of tokens in existence.                                                                                                                                                                            |
| `transfer(address recipient, uint256 amount)`                     | Moves a `value` amount of tokens from the caller's account to `to`. Returns a boolean value indicating whether the operation succeeded.                                                                              |
| `transferFrom(address sender, address recipient, uint256 amount)` | Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism. `value` is then deducted from the caller's allowance. Returns a boolean value indicating whether the operation succeeded.        |

| Event                                                                      | Comment                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Approval(address indexed owner, address indexed spender, uint256 amount)` | Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance. This event should be emitted by the `approve` method. See https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#events for more information.              |
| `Transfer(address indexed from, address indexed to, uint256 amount)`       | Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero. This event should be emitted by `transfer` and `transferFrom` methods. See https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#events for more information. |

<!-- -->

#### Association Methods Interface

<!-- !./scripts/abi-table.js out/IHRC719.sol/IHRC719.json -->

| Function              | Comment                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `associate()`         | Associates the calling account with the token. This function allows an account to opt-in to receive the token                   |
| `dissociate()`        | Dissociates the calling account from the token. This function allows an account to opt-out from receiving the token             |
| `isAssociated() view` | Checks if the calling account is associated with the token. This function returns the association status of the calling account |

<!-- -->

### Non-Fungible Tokens

The following methods and events are applicable to Non-Fungible Tokens.

<!-- !./scripts/abi-table.js out/IERC721.sol/IERC721.json -->

| Function                                                                    | Comment                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `approve(address spender, uint256 serialId) payable`                        | Gives permission to `spender` to transfer `serialId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `serialId` must exist. Emits an {Approval} event. |
| `balanceOf(address owner) view`                                             | Returns the number of tokens in `owner`'s account.                                                                                                                                                                                                                                                                                                                            |
| `getApproved(uint256 serialId) view`                                        | Returns the account approved for `serialId` token. Requirements: - `serialId` must exist.                                                                                                                                                                                                                                                                                     |
| `isApprovedForAll(address owner, address operator) view`                    | Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}                                                                                                                                                                                                                                                                          |
| `name() view`                                                               | Returns the token collection name.                                                                                                                                                                                                                                                                                                                                            |
| `ownerOf(uint256 serialId) view`                                            | Returns the owner of the `serialId` token. Requirements: - `serialId` must exist. This value changes when {approve} or {transferFrom} are called.                                                                                                                                                                                                                             |
| `setApprovalForAll(address operator, bool approved)`                        | Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the address zero. Emits an {ApprovalForAll} event.                                                                                                                            |
| `symbol() view`                                                             | Returns the token collection symbol.                                                                                                                                                                                                                                                                                                                                          |
| `tokenURI(uint256 serialId) view`                                           | Returns the Uniform Resource Identifier (URI) for `serialId` token.                                                                                                                                                                                                                                                                                                           |
| `totalSupply() view`                                                        | Returns the total amount of tokens stored by the contract.                                                                                                                                                                                                                                                                                                                    |
| `transferFrom(address sender, address recipient, uint256 serialId) payable` | Transfers `serialId` token from `sender` to `recipient`. Requirements: - `sender` cannot be the zero address. - `recipient` cannot be the zero address. - `serialId` token must be owned by `sender`. - If the caller is not `sender`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.                           |

| Event                                                                                | Comment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)` | Emitted when the approved address for an NFT is changed or reaffirmed from {from} to {to} address. The zero {to} address indicates there will be no approved address. Additionally the approved address for that NFT (if any) is reset to none. This event should be emitted by the `approve` method. See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information.                                                                                                                                                                                                                                                                                                        |
| `ApprovalForAll(address indexed owner, address indexed operator, bool approved)`     | Emitted when an operator {operator} is enabled or disabled {approved} for an owner {owner}. The operator {operator} can than manage all NFTs of the owner {owner}. This event should be emitted by the `setApprovalForAll` method. See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information.                                                                                                                                                                                                                                                                                                                                                                           |
| `Transfer(address indexed from, address indexed to, uint256 indexed tokenId)`        | Emitted when ownership of any NFT changes by any mechanism. This event emits when NFTs are created (`from` == 0) and destroyed (`to` == 0). Otherwise, it indicates that the token with ID {tokenId} was transferred from {from} to {to}, where {from} represents the previous owner of the token, not the approved spender. Exception: during contract creation, any number of NFTs may be created and assigned without emitting Transfer. At the time of any transfer, the approved address for that NFT (if any) is reset to none. This event should be emitted by `transfer` and `transferFrom` methods. See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information. |

<!-- -->

#### Association Methods Interface

<!-- !./scripts/abi-table.js out/IHRC719.sol/IHRC719.json -->

| Function              | Comment                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `associate()`         | Associates the calling account with the token. This function allows an account to opt-in to receive the token                   |
| `dissociate()`        | Dissociates the calling account from the token. This function allows an account to opt-out from receiving the token             |
| `isAssociated() view` | Checks if the calling account is associated with the token. This function returns the association status of the calling account |

<!-- -->

### Hedera Token Service (located at address `0x167`)

The following methods can be invoked on the Hedera Token Service contract located at address `0x167`.

<!-- !./scripts/abi-table.js out/IHederaTokenService.sol/IHederaTokenService.json -->

| Function                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Comment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowance(address token, address owner, address spender) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Returns the amount which spender is still allowed to withdraw from owner. Only Applicable to Fungible Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `approve(address token, address spender, uint256 amount)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Allows spender to withdraw from your account multiple times, up to the value amount. If this function is called again it overwrites the current allowance with value. Only Applicable to Fungible Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `approveNFT(address token, address approved, uint256 serialNumber)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Allow or reaffirm the approved address to transfer an NFT the approved address does not own. Only Applicable to NFT Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `associateToken(address account, address token)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Single-token variant of associateTokens. Will be mapped to a single entry array call of associateTokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `associateTokens(address account, address[] tokens)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Associates the provided account with the provided tokens. Must be signed by the provided Account's key or called from the accounts contract key If the provided account is not found, the transaction will resolve to INVALID_ACCOUNT_ID. If the provided account has been deleted, the transaction will resolve to ACCOUNT_DELETED. If any of the provided tokens is not found, the transaction will resolve to INVALID_TOKEN_REF. If any of the provided tokens has been deleted, the transaction will resolve to TOKEN_WAS_DELETED. If an association between the provided account and any of the tokens already exists, the transaction will resolve to TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT. If the provided account's associations count exceed the constraint of maximum token associations per account, the transaction will resolve to TOKENS_PER_ACCOUNT_LIMIT_EXCEEDED. On success, associations between the provided account and tokens are made and the account is ready to interact with the tokens.                                                                                                                                                                                                |
| `burnToken(address token, int64 amount, int64[] serialNumbers)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Burns an amount of the token from the defined treasury account                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `createFungibleToken((string name, string symbol, address treasury, string memo, bool tokenSupplyType, int64 maxSupply, bool freezeDefault, (uint256 keyType, (bool inheritAccountKey, address contractId, bytes ed25519, bytes ECDSA_secp256k1, address delegatableContractId) key)[] tokenKeys, (int64 second, address autoRenewAccount, int64 autoRenewPeriod) expiry) token, int64 initialTotalSupply, int32 decimals) payable`                                                                                                                                                                                                                                                                                       | Creates a Fungible Token with the specified properties                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `createFungibleTokenWithCustomFees((string name, string symbol, address treasury, string memo, bool tokenSupplyType, int64 maxSupply, bool freezeDefault, (uint256 keyType, (bool inheritAccountKey, address contractId, bytes ed25519, bytes ECDSA_secp256k1, address delegatableContractId) key)[] tokenKeys, (int64 second, address autoRenewAccount, int64 autoRenewPeriod) expiry) token, int64 initialTotalSupply, int32 decimals, (int64 amount, address tokenId, bool useHbarsForPayment, bool useCurrentTokenForPayment, address feeCollector)[] fixedFees, (int64 numerator, int64 denominator, int64 minimumAmount, int64 maximumAmount, bool netOfTransfers, address feeCollector)[] fractionalFees) payable` | Creates a Fungible Token with the specified properties                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `createNonFungibleToken((string name, string symbol, address treasury, string memo, bool tokenSupplyType, int64 maxSupply, bool freezeDefault, (uint256 keyType, (bool inheritAccountKey, address contractId, bytes ed25519, bytes ECDSA_secp256k1, address delegatableContractId) key)[] tokenKeys, (int64 second, address autoRenewAccount, int64 autoRenewPeriod) expiry) token) payable`                                                                                                                                                                                                                                                                                                                              | Creates an Non Fungible Unique Token with the specified properties                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `createNonFungibleTokenWithCustomFees((string name, string symbol, address treasury, string memo, bool tokenSupplyType, int64 maxSupply, bool freezeDefault, (uint256 keyType, (bool inheritAccountKey, address contractId, bytes ed25519, bytes ECDSA_secp256k1, address delegatableContractId) key)[] tokenKeys, (int64 second, address autoRenewAccount, int64 autoRenewPeriod) expiry) token, (int64 amount, address tokenId, bool useHbarsForPayment, bool useCurrentTokenForPayment, address feeCollector)[] fixedFees, (int64 numerator, int64 denominator, int64 amount, address tokenId, bool useHbarsForPayment, address feeCollector)[] royaltyFees) payable`                                                  | Creates an Non Fungible Unique Token with the specified properties                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `dissociateToken(address account, address token)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Single-token variant of dissociateTokens. Will be mapped to a single entry array call of dissociateTokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `dissociateTokens(address account, address[] tokens)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Dissociates the provided account with the provided tokens. Must be signed by the provided Account's key. If the provided account is not found, the transaction will resolve to INVALID_ACCOUNT_ID. If the provided account has been deleted, the transaction will resolve to ACCOUNT_DELETED. If any of the provided tokens is not found, the transaction will resolve to INVALID_TOKEN_REF. If any of the provided tokens has been deleted, the transaction will resolve to TOKEN_WAS_DELETED. If an association between the provided account and any of the tokens does not exist, the transaction will resolve to TOKEN_NOT_ASSOCIATED_TO_ACCOUNT. If a token has not been deleted and has not expired, and the user has a nonzero balance, the transaction will resolve to TRANSACTION_REQUIRES_ZERO_TOKEN_BALANCES. If a <b>fungible token</b> has expired, the user can disassociate even if their token balance is not zero. If a <b>non fungible token</b> has expired, the user can <b>not</b> disassociate if their token balance is not zero. The transaction will resolve to TRANSACTION_REQUIRED_ZERO_TOKEN_BALANCES. On success, associations between the provided account and tokens are removed. |
| `getApproved(address token, uint256 serialNumber) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Get the approved address for a single NFT Only Applicable to NFT Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getFungibleTokenInfo(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Query fungible token info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `getNonFungibleTokenInfo(address token, int64 serialNumber) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Query non fungible token info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `getTokenCustomFees(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Query token custom fees                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getTokenDefaultFreezeStatus(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Query token default freeze status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `getTokenDefaultKycStatus(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Query token default kyc status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `getTokenExpiryInfo(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Query token expiry info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getTokenInfo(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Query token info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `getTokenKey(address token, uint256 keyType) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Query token KeyValue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `getTokenType(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Query to return the token type for a given address                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `isApprovedForAll(address token, address owner, address operator) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Query if an address is an authorized operator for another address Only Applicable to NFT Tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `isToken(address token) view`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Query if valid token found for the given address                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `mintToken(address token, int64 amount, bytes[] metadata)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Mints an amount of the token to the defined treasury account                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `setApprovalForAll(address token, address operator, bool approved)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Enable or disable approval for a third party ("operator") to manage all of `msg.sender`'s assets                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `transferFrom(address token, address from, address to, uint256 amount)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Only applicable to fungible tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `transferFromNFT(address token, address from, address to, uint256 serialNumber)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Transfers `serialNumber` of `token` from `from` to `to` using the allowance mechanism. Only applicable to NFT tokens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `transferNFT(address token, address sender, address recipient, int64 serialNumber)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Transfers tokens where the calling account/contract is implicitly the first entry in the token transfer list, where the amount is the value needed to zero balance the transfers. Regular signing rules apply for sending (positive amount) or receiving (negative amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `transferNFTs(address token, address[] sender, address[] receiver, int64[] serialNumber)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Initiates a Non-Fungable Token Transfer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `transferToken(address token, address sender, address recipient, int64 amount)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Transfers tokens where the calling account/contract is implicitly the first entry in the token transfer list, where the amount is the value needed to zero balance the transfers. Regular signing rules apply for sending (positive amount) or receiving (negative amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `transferTokens(address token, address[] accountId, int64[] amount)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Initiates a Fungible Token Transfer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

<!-- -->

## JS Library

Service and application builders can use the core state emulation library.
These functions can be embedded in a JSON-RPC implementation to enable System Contracts fork testing without using the Hardhat plugin.

```javascript
const { getHtsCode, getHtsStorageAt, getHIP719Code } = require('@hashgraph/system-contracts-forking');
```

- **`getHtsCode`**. Gets the runtime bytecode for the Solidity implementation of the HTS System Contract.
- **`getHtsStorageAt`**. Allows the user to query the state of an HTS Token as if it were a standard smart contract.
- **`getHIP719Code`**. Returns the token proxy contract bytecode for the given `address`. Based on the proxy contract defined by [HIP-719](https://hips.hedera.com/hip/hip-719).

See [`index.d.ts`](./src/index.d.ts) for more details.

At its core, the [_Hardhat plugin_](#hardhat-plugin) is supported by these functions.

## Build

This repo consists of a Foundry project and an `npm` package.
A Foundry project, to compile and test the [`HtsSystemContract.sol`](./contracts/HtsSystemContract.sol) contract.
And an `npm` package that implements both `eth_getCode` and `eth_getStorageAt` JSON-RPC methods when HTS emulation is involved together with the Hardhat plugin that uses these methods.

To compile the `HtsSystemContract`, its dependencies and the test contracts run

```console
forge build
```

There is no compilation step to build the `npm` package.
However, you can type-check it by running

```console
npm run type-check
```

The code examples and the tables for supported methods included in this `README` are automatically generated.
Run the following command to generate them

```console
npm run make:readme
```

This allow us to ensure that all examples and tables are never outdated (if we change them we just need to rerun the above command) and that the examples are executed properly (we run them on CI).

Code fences that contains a file name after the language definition, _e.g._,

````markdown
  ```solidity examples/foundry-hts/test/USDC.t.sol
  ```
````

or comments such as

```markdown
  <!-- !./scripts/abi-table.js out/IERC20.sol/IERC20.json -->
  <!-- -->
```

will be expanded with either the content of the file or, when the file descriptor starts with a `!`, with the standard output of the application.

## Tests

> [!TIP]
> The `scripts/create-token.js` file was used to deploy Tokens using HTS to `testnet` for testing purposes.

### `getHtsCode`, `getHtsStorageAt` and `getHIP719Code` Unit Tests

These tests only involve testing `getHtsCode`, `getHtsStorageAt` and `getHIP719Code` functions.
In other words, they do not use the `HtsSystemContract` bytecode, only its `storageLayout` definition. To run them, execute

```console
npm run test
```

> [!TIP]
> You may want to run the `npm` tests without the Hardhat plugin tests.
> To do so, you can use the [`--fgrep`](https://mochajs.org/#-fgrep-string-f-string) or [`--grep`](https://mochajs.org/#-grep-regexp-g-regexp) flags together with [`--invert`](https://mochajs.org/#-invert), for example
>
> ```console
> npm run test -- --grep ::plugin --invert
> ```

All top-level `mocha`'s `describe`s should be prefixed with `::` so it can be easy to filter by tests.

### `HtsSystemContract` Solidity tests + local storage emulation (_without_ forking)

We use Foundry cheatcodes, _i.e._,
[`vm.store`](https://book.getfoundry.sh/cheatcodes/store) and
[`vm.load`](https://book.getfoundry.sh/cheatcodes/load),
to provide local storage emulation that allow us to run `HtsSystemContract` Solidity tests without starting out a separate JSON-RPC process.

```console
forge test
```

> [!TIP]
> You can use the `--match-contract` flag to filter the tests to be executed if needed.
> In addition, usually when debugging the contract under test we are interested in getting the Solidity traces.
> We can use the `forge` flag `-vvvv` to display them.
> For example
>
> ```console
> forge test --match-contract TokenTest -vvvv
> ```

When running these tests **without** forking from a remote network,
the package `@hashgraph/hedera-forking` is not under test.

### `HtsSystemContract` Solidity tests + Mirror Node FFI (with mocked `curl`)

This is used to test [`HtsSystemContract`(`Json`)](./contracts/HtsSystemContractJson.sol)+[`MirrorNodeFFI`](./contracts/MirrorNodeFFI.sol) contracts.
It is the implementation used by Foundry users.

We provide a [`curl`](./test/scripts/curl) mock in the `test/scripts` folder to avoid depending on a remote Mirror Node and thus making the tests more robust.
By modifiying the `PATH` environment variable, the mocked `curl` is used instead.

```console
PATH=./test/scripts:$PATH forge test --fork-url https://testnet.hashio.io/api --fork-block-number 13890397
```

In case needed, there is a trace log of requests made by mocked `curl` in `scripts/curl.log`

```console
cat test/scripts/curl.log
```

> [!NOTE]
> Since the Windows-based solution does not use `curl`, the mocked `curl` behavior will have no effect on it.
> Mocked `curl` is designed exclusively for Unix-like operating systems.

### `HtsSystemContract` Solidity tests + JSON-RPC mock server for storage emulation (_with_ forking)

These Solidity tests are used to test both the `HtsSystemContract` and the `npm` package.
It is the implementation used by Hardhat users.

Instead of starting a `local-node` or using a remote network,
they use the [`json-rpc-mock.js`](./test/scripts/json-rpc-mock.js) script as a backend without the need for any additional services,
thus making the tests more robust.
This is the network Foundry's Anvil is forking from.

In a separate terminal run the JSON-RPC Mock Server

```console
./test/scripts/json-rpc-mock.js
```

Then run

```console
forge test --fork-url http://localhost:7546 --no-storage-caching
```

> [!IMPORTANT]
> The `--no-storage-caching` flag disables the JSON-RPC calls cache,
> which is important to make sure the `json-rpc-mock.js` is reached in each JSON-RPC call.
> See <https://book.getfoundry.sh/reference/forge/forge-test#description> for more information.

### Validating HTS emulation end-to-end test

The goal of this test is to validate that our HTS emulation matches the behavior of the real HTS (provided by Hedera Services).
The test works as follow.
It first creates an HTS token on a Local Node.
Then, it proceeds to start a local network (Foundry's Anvil) forked from the Local Node after token creation.
The same test cases are executed on both networks, first on Anvil, and then on Local Node, where they yield the same result.

> [!NOTE]
> The test sets the `DEBUG_DISABLE_BALANCE_BLOCKNUMBER` environment variable used by the Mirror Node client.
> This flag was introduced **just** for this test.
> It makes the Mirror Node client retrieve balances without honoring the block number.
> This in turn fetches the correct balance in the case where the Mirror Node did not get the latest balance snapshot from the Consensus Node.
> This simplifies the validation tests considerably, and allows to compare behavior of real HTS and emulated HTS more easily.

You need a Local Node running in order to execute this test.
See [Hedera Local Node, _&sect; Requirements_](https://github.com/hashgraph/hedera-local-node?tab=readme-ov-file#requirements) for tools needed to run it.
To do so, run the following

```console
npm run hedera:start
```

> Alternatively, once you are done with this test, you can stop the Local Node using
>
> ```console
> npm run hedera:stop
> ```

Once Local Node is up and running, run the validation tests with

```console
npm run test:e2e
```

## Coverage

Run NPM tests with coverage using

```console
npm run coverage
```

Similarly, Solidity test coverage can be obtained using the [`forge coverage`](https://book.getfoundry.sh/reference/forge/forge-coverage) command, for example

```console
forge coverage
```

The [&sect; _Tests_](#tests) describes different test execution settings depending on the contracts to be tested.

> [!IMPORTANT]
> To obtain accurate coverage reports remember to clean up any cache related data.
>
> Both Foundry and Hardhat cache successful JSON-RPC calls when running tests.
> This means that when RPC calls are cached, there are fewer calls made to the forking library.
> This in turn make coverage reports provide inaccurate results.
>
> Foundry's JSON-RPC cache can be displayed and cleaned up using the [`forge cache`](https://book.getfoundry.sh/reference/forge/forge-cache) command.
> Its cache it is usually located in `~/.foundry/cache/`.
>
> On the other hand, Hardhat cache is located under each plugin tests, _i.e_, `test/plugin/*/cache`.

Test coverage reports based on [_&sect; Tests_](#tests) are uploaded to [Codecov](https://codecov.io/gh/hashgraph/hedera-forking)

[![codecov Sunburst](https://codecov.io/gh/hashgraph/hedera-forking/graphs/sunburst.svg?token=NNW96R6VIE)](https://codecov.io/gh/hashgraph/hedera-forking)

## Support

If you have a question on how to use the product, please see our
[support guide](https://github.com/hashgraph/.github/blob/main/SUPPORT.md).

## Contributing

Contributions are welcome. Please see the
[contributing guide](https://github.com/hashgraph/.github/blob/main/CONTRIBUTING.md)
to see how you can get involved.

## Code of Conduct

This project is governed by the
[Contributor Covenant Code of Conduct](https://github.com/hashgraph/.github/blob/main/CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code of conduct. Please report unacceptable behavior
to [oss@hedera.com](mailto:oss@hedera.com).

## License

[Apache License 2.0](LICENSE)

## Security

Please do not file a public ticket mentioning the vulnerability.
Refer to the security policy defined in the [SECURITY.md](SECURITY.md).
