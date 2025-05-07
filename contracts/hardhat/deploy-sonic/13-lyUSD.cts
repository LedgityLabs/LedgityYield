import fs from "fs";
import { type DeployFunction } from "hardhat-deploy/dist/types";
import { isAddress, zeroAddress } from "viem";

const LTOKEN_SYMBOL = "LUSDC";
const WRAPPED_LTOKEN_NAME = "Wrapped Ledgity USD";
const WRAPPED_LTOKEN_SYMBOL = "lyUSD";

if (!fs.existsSync("temp/lTokenDeploys.json"))
  throw new Error("lTokenDeploys.json not found");

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Retrieve global contracts
  const globalOwner = await deployments.get("GlobalOwnerSonic");
  const globalPause = await deployments.get("GlobalPauseSonic");
  const globalBlacklist = await deployments.get("GlobalBlacklistSonic");

  const lTokenDeploys: {
    [chainId: string]: {
      [symbol: string]: string;
    };
  } = JSON.parse(fs.readFileSync("temp/lTokenDeploys.json", "utf8"));

  // Check if the underlying lToken is set in dependencies
  const lTokenAddress = lTokenDeploys?.[chainId]?.[LTOKEN_SYMBOL];
  if (
    !lTokenAddress ||
    lTokenAddress === zeroAddress ||
    !isAddress(lTokenAddress)
  )
    throw new Error(
      `Missing or invalid ${LTOKEN_SYMBOL} address for chain ${chainId}`,
    );

  // Deploy the LToken
  await deployments.deploy(WRAPPED_LTOKEN_SYMBOL, {
    contract: "WrappedLTokenSonic",
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      implementationName: "WrappedLTokenSonic_Implementation",
      execute: {
        init: {
          methodName: "initializeAndRegister",
          args: [
            globalOwner.address,
            globalPause.address,
            globalBlacklist.address,
            lTokenAddress,
            WRAPPED_LTOKEN_NAME,
            WRAPPED_LTOKEN_SYMBOL,
          ],
        },
      },
    },
    waitConfirmations: 1,
  });
};

export default deployerFunction;
