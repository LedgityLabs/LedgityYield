import fs from "fs";
import { type DeployFunction } from "hardhat-deploy/dist/types";

if (!fs.existsSync("../../temp/lTokenDeploys.json")) {
  fs.mkdirSync("../../temp");
  fs.writeFileSync("../../temp/lTokenDeploys.json", "{}", "utf8");
}

module.exports = (async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const result = await deployments.deploy("LDY", {
    from: deployer,
    contract: "LDY",
    log: true,
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });

  // Update lTokenDeploys.json
  const lTokenDeploys: {
    [chainId: string]: {
      [symbol: string]: string;
    };
  } = JSON.parse(fs.readFileSync("../../temp/lTokenDeploys.json", "utf8"));
  lTokenDeploys[chainId]["LDY"] = result.address;
  fs.writeFileSync(
    "../../temp/lTokenDeploys.json",
    JSON.stringify(lTokenDeploys, null, 2),
    "utf8",
  );
}) as DeployFunction;
