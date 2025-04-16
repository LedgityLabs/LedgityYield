import { task } from "hardhat/config";

task("deploy-mock-ccip-token", "Deploy a MockCCIPToken contract").setAction(
  async (taskArgs, hre) => {
    await hre.run("compile");

    console.log(`\nDeploying MockCCIPToken...`);

    // Get the contract factory
    const MockCCIPToken = await hre.ethers.getContractFactory("MockCCIPToken");

    // Deploy the contract
    const token = await MockCCIPToken.deploy();

    const address = token.address;
    console.log(`MockCCIPToken deployed to: ${address}`);
  },
);
