# Frequently Asked Questions

The following is a collection of common issues or errors developers first encounter when working with Hedera System Contracts in a forked environment.

The Hedera Forking project solves these issues by providing an emulation of Hedera System Contracts written in Solidity.
Enable either the [Foundry library](./README.md#foundry-library) or the [Hardhat plugin](./README.md#hardhat-plugin) to solve them.

## Foundry

### What causes the error `EvmError: InvalidFEOpcode`?

The reason of error `EvmError: InvalidFEOpcode` is related to how Foundry executes scripts.
It first runs the script on its local network.
It records the operations made to be replayed in the remote network.
See <https://book.getfoundry.sh/guides/scripting-with-solidity#overview> for more info.
Given Foundry's local network does not have a System Contract implementation,
the error is thrown.
This is not Hedera specific actually.
Any network that includes non-standard _"precompiles"_, _i.e._, System Contracts, will suffer the same problem.

Regarding tests, the error is due to trying to execute any System Contract method in a forked environment.
More specifically, when Foundry runs in a forked environment, it uses a local EVM network.
It fetches remote bytecode to be executed locally using the `eth_getCode` JSON-RPC endpoint.
However, System Contracts do not have a corresponding EVM bytecode (it's implemented natively inside the Hedera network).
That is why when trying to get the code, for example using `cast code --rpc-url https://mainnet.hashio.io/api` `0x0000000000000000000000000000000000000167`,
address of the HTS System Contract, you get `0xfe`.
That leads to the error `EvmError: InvalidFEOpcode` mentioned in the question.

### Why am I getting error "`Member "keyExistsJson" not found or not visible`" when compiling my project?

If you get the following error when compiling your project

```console
$ forge build
[...]
Error: Compiler run failed:
Error (9582): Member "keyExistsJson" not found or not visible after argument-dependent lookup in contract Vm.
```

it is because your `forge-std` dependency is outdated.
You can [update](https://book.getfoundry.sh/reference/forge/forge-update) `forge-std` with

```sh
forge update lib/forge-std
```

See [_&sect; Requirements_](./README.md#requirements) for the full list of requirements needed to compile your project.

## Hardhat

### What causes the error `ProviderError: No known hardfork for execution`

From <https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#using-a-custom-hardfork-history>

> If you're forking an unusual network, and if you want to execute EVM code in the context of a historical block retrieved from that network, then you will need to configure Hardhat Network to know which hardforks to apply to which blocks. (If you're forking a well-known network, Hardhat Network will automatically choose the right hardfork for the execution of your EVM code, based on known histories of public networks, so you can safely ignore this section.)
>
> _[...]_
>
> In this context, a "historical block" is one whose number is prior to the block you forked from. If you try to run code in the context of a historical block, without having a hardfork history, then an error will be thrown. The known hardfork histories of most public networks are assumed as defaults.

The Hardhat plugin sets the hardfork for the Hedera networks to fix this issue.

### What causes the `Error: Missing access list`?

When forking from a Hedera network using a given `blockNumber`, Hardhat fails with the following error

```txt
     Error: Missing access list
```

This happens when the JSON-RPC Relay returns **EIP-1559** typed transactions `"type": "0x2"`.
In this case, the `accessField` field is missing, hence the error.
**However, please note that if `blockNumber` is not provided, Hardhat behaves as expected.**

The Hardhat plugin solves this problem by providing an empty access list when making JSON-RPC requests to the remote networ.
