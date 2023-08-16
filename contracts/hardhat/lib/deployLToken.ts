import { type DeployFunction } from "hardhat-deploy/dist/types";
import dependencies from "../../dependencies.json";

export const deployLToken = (lTokenSymbol: string, underlyingSymbol: string) => {
  return (async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    // Retrieve global contracts
    const globalOwner = await deployments.get("GlobalOwner");
    const globalPause = await deployments.get("GlobalPause");
    const globalBlacklist = await deployments.get("GlobalBlacklist");

    // Retrieve LDYStaking contract
    const ldyStaking = await deployments.get("LDYStaking");

    // Retrieve APRHistory library
    const aprHistory = await deployments.get("APRHistory");

    // Deploy fake underlying token if running on localnet
    let underlyingAddress: string;
    if (chainId === "31337") {
      const fakeUnderlying = await deployments.deploy(underlyingSymbol, {
        contract: "GenericERC20",
        from: deployer,
        log: true,
        args: [`Fake ${underlyingSymbol}`, underlyingSymbol, 6],
      });
      underlyingAddress = fakeUnderlying.address;
    }
    // Else use network implementation of the underlying token
    else {
      const missingAddressError = new Error(
        `${underlyingSymbol} address not available, ensure it is set in dependencies.json`,
      );
      // Check if the underlying token is set in dependencies.json
      if (!Object.keys(dependencies).includes(underlyingSymbol)) throw missingAddressError;

      // Check address of underlying token is available for the current chain in dependencies.json
      // @ts-ignore
      if (!Object.keys(dependencies[underlyingSymbol]).includes(chainId)) throw missingAddressError;

      // Retrieve underlying token address from dependencies.json
      // @ts-ignore
      underlyingAddress = dependencies[underlyingSymbol][chainId];
    }

    // Deploy the LToken
    await deployments.deploy(lTokenSymbol, {
      contract: "LToken",
      from: deployer,
      log: true,
      proxy: {
        proxyContract: "UUPS",
        execute: {
          init: {
            methodName: "initialize",
            args: [
              globalOwner.address,
              globalPause.address,
              globalBlacklist.address,
              ldyStaking.address,
              underlyingAddress,
            ],
          },
        },
      },
      // gasLimit: 30000000, // Required as RPC node fails to estimate gas limit
      libraries: {
        APRHistory: aprHistory.address,
      },
      waitConfirmations: chainId == "31337" ? 1 : 1,
    });
  }) as DeployFunction;
};
