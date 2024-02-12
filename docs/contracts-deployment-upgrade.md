# Contracts deployment and upgrade

## Initial deployment

Run `pnpm hardhat deploy --network <network>` to deploy all protocol's contracts on a given network

## Additional deployment

In case a new contract/deployment is added to the code base (e.g., a new L-Token), the above command can also be used to deploy it as it won't try to re-deploy already deployed contracts.

## Upgrade

1. Copy current implementation `.json` files from `contracts/hardhat/deployments/<network>` to `contracts/hardhat/archive/<network>`
2. Run `pnpm hardhat deploy --network <network>` to deploy the new implementation
3. Propose the new implementation using OpenZeppelin Defender, to the multisig owner
4. Verify the new implementation on Etherscan/Arbiscan, etc.
