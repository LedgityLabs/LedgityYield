import fs from "fs";
import type { DeployFunction } from "hardhat-deploy/dist/types";
import { isAddress, zeroAddress } from "viem";
import { dependencies } from "../../dependencies.cts";

const LTOKEN_SYMBOL = "LEURC";
const UNDERLYING_TOKEN_SYMBOL = "EURC";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Retrieve global contracts
  const globalOwner = await deployments.get("GlobalOwner");
  const globalPause = await deployments.get("GlobalPause");
  const globalBlacklist = await deployments.get("GlobalBlacklist");
  const ldyStaking = await deployments.get("LDYStaking");
  const aprHistory = await deployments.get("APRHistory");

  if (!fs.existsSync("temp/lTokenDeploys.json")) {
    fs.mkdirSync("temp", { recursive: true });
    fs.writeFileSync("temp/lTokenDeploys.json", "{}", "utf8");
  }

  // Check if the underlying token is set in dependencies
  const underlyingAddress = dependencies[chainId][UNDERLYING_TOKEN_SYMBOL];
  if (
    !underlyingAddress ||
    underlyingAddress === zeroAddress ||
    !isAddress(underlyingAddress)
  )
    throw new Error(
      `Missing ${UNDERLYING_TOKEN_SYMBOL} address for chain ${chainId}`,
    );

  // Deploy the LToken
  const result = await deployments.deploy(LTOKEN_SYMBOL, {
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
    waitConfirmations: 1,
  });

  // Update lTokenDeploys.json
  const lTokenDeploys: {
    [chainId: string]: {
      [symbol: string]: string;
    };
  } = JSON.parse(fs.readFileSync("temp/lTokenDeploys.json", "utf8"));

  lTokenDeploys[chainId] ??= {};
  lTokenDeploys[chainId][LTOKEN_SYMBOL] = result.address;

  fs.writeFileSync(
    "temp/lTokenDeploys.json",
    JSON.stringify(lTokenDeploys, null, 2),
    "utf8",
  );
};

export default deployerFunction;
