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
        args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
      },
    },
    log: true,
    waitConfirmations: chainId == "31337" ? 1 : 2,
  });

  console.log("EthVault deployed to:", ethVault.address);
};

export default func;
func.tags = ["EthVault"];