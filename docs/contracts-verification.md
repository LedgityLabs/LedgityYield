1. Run `pnpm hardhat etherscan-verify --network <network> --solc-input`

- This command will fail to verify L-Token implementation (unless the bug is fixed)

2. To verify the implementation of a L-Token run: `npx hardhat verify --network <network> <impl_address>`
3. Finally, proxy need to b
