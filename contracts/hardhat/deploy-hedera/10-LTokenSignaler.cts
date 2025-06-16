import fs from "fs";
import { type DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";

const LTOKEN_SYMBOLS = ["LUSDC"];

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const globalOwner = await deployments.get("GlobalOwner");

  const result = await deployments.deploy("LTokenSignaler", {
    from: deployer,
    log: true,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        init: {
          methodName: "initialize",
          args: [globalOwner.address],
        },
      },
    },
    waitConfirmations: 1,
  });

  // Skip signaling tokens if this is the previous deployment
  if (!result.newlyDeployed) return;

  if (!fs.existsSync("temp/lTokenDeploys.json")) return;

  const lTokenDeploys: {
    [chainId: string]: {
      [symbol: string]: string;
    };
  } = JSON.parse(fs.readFileSync("temp/lTokenDeploys.json", "utf8"));

  const lTokenSignaler = await ethers.getContractAt(
    "LTokenSignaler",
    result.address,
  );

  for (const symbol of LTOKEN_SYMBOLS) {
    const lTokenAddress = lTokenDeploys?.[chainId]?.[symbol];
    if (!lTokenAddress) continue;

    await lTokenSignaler
      .signalLToken(lTokenAddress)
      .then((tx: any) => tx.wait(1));

    console.log(`=> LToken ${symbol} signaled`);
  }
};

export default deployerFunction;
