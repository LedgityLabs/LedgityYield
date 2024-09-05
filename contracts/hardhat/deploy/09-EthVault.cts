import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts,getChainId } = hre;
const chainId = await getChainId();
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const ethVault = await deploy("EthVault", {
    from: deployer,
    proxy: {
      proxyContract: "UUPS",
      execute: {
        methodName: "initialize",
        args: ["0x257b728F2841F44d22E5F06f76D0a67467ACbD35"],
      },
    },
    log: true,
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });

  console.log("EthVault deployed to:", ethVault.address);
};

export default func;
func.tags = ["EthVault"];