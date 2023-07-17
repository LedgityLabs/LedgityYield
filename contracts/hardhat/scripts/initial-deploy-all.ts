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

  // Deploy LTYStaking contract
  // Note: If testnet, deploy a fake $LTY and token
  if (isTestnet) await deploy("GenericERC20", ["Fake LTY", "LTY", 18]);
  const ltyStaking = await (await import("./deploy-LTYStaking")).default;

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

  // Initialize LTYStaking contract data
  ltyStaking!.setAPR(parseUnits("20", 3));
  ltyStaking!.setTier(1, 0);
  ltyStaking!.setTier(2, parseUnits("5000", 18));
  ltyStaking!.setTier(3, parseUnits("50000", 18));

  // Initialize L-Tokens contracts data
  for (let lToken of lTokens) {
    lToken!.setLTYStaking(await ltyStaking!.getAddress());
    lToken!.setAPR(5000);
    lToken!.setFeesRate(300); // SHOULD BE INITIALIZED IN CONTRACT
    lToken!.setRetentionRate(5000); // SHOULD BE INITIALIZED IN CONTRACT
    lToken!.setFund("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
    lToken!.setWithdrawer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
