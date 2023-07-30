import { parseUnits } from "viem";
import { testnetIds } from "../../deployments";
import { getChainId } from "./lib/getChainId";
import { deploy } from "./lib/deploy";

export const main = async () => {
  // Retrieve current chainId and whether this is a testnet
  const chainId = getChainId();
  const isTestnet = testnetIds.includes(chainId);

  // ########################
  // ### Deploy contracts ###
  // ########################
  // Deploy GlobalOwner, GlobalPause, GlobalBlacklist
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  await (
    await import("./deploy-GlobalPause")
  ).default;
  await (
    await import("./deploy-GlobalBlacklist")
  ).default;

  // Deploy LDYStaking contract
  // Note: If testnet, deploy a fake $LDY and token
  if (isTestnet) await deploy("GenericERC20", ["Fake LDY", "LDY", 18]);
  const ldyStaking = await (await import("./deploy-LDYStaking")).default;

  // Deploy L-Tokens contracts
  // Note: If testnet, deploy a fake underlying tokens
  if (isTestnet) {
    await deploy("GenericERC20", ["Fake USDC", "USDC", 6]);
    await deploy("GenericERC20", ["Fake EUROC", "EUROC", 6]);
  }
  let lTokens = [
    await (await import("./deploy-LUSDC")).default,
    await (await import("./deploy-LEUROC")).default,
  ];
  await (
    await import("./deploy-LTokenSignaler")
  ).default;
  await (
    await import("./deploy-Multicall3")
  ).default;

  // ##############################
  // ### Initialize some states ###
  // ##############################

  // Initialize LDYStaking contract data
  ldyStaking!.setAPR(parseUnits("20", 3));
  ldyStaking!.setTier(1, 0);
  ldyStaking!.setTier(2, parseUnits("5000", 18));
  ldyStaking!.setTier(3, parseUnits("50000", 18));

  // Initialize L-Tokens contracts data
  for (let lToken of lTokens) {
    lToken!.setAPR(5000);
    lToken!.setFund("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
    lToken!.setWithdrawer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
