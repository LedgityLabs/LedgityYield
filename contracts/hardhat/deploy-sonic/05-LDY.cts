import fs from "fs";
import { type DeployFunction } from "hardhat-deploy/dist/types";

const deployerFunction: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  if (!fs.existsSync("temp/lTokenDeploys.json")) {
    fs.mkdirSync("temp");
    fs.writeFileSync("temp/lTokenDeploys.json", "{}", "utf8");
  }

  const result = await deployments.deploy("LDYSonic", {
    from: deployer,
    contract: "LDY",
    log: true,
    waitConfirmations: 1,
  });

  // Update lTokenDeploys.json
  const lTokenDeploys: {
    [chainId: string]: {
      [symbol: string]: string;
    };
  } = JSON.parse(fs.readFileSync("temp/lTokenDeploys.json", "utf8"));

  lTokenDeploys[chainId] ??= {};
  lTokenDeploys[chainId]["LDY"] = result.address;

  fs.writeFileSync(
    "temp/lTokenDeploys.json",
    JSON.stringify(lTokenDeploys, null, 2),
    "utf8",
  );
};

export default deployerFunction;
