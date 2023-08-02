import { getChainId } from "./lib/getChainId";
import { deploy } from "./lib/deploy";

export const main = async () => {
  // Retrieve current chainId and whether this is a testnet
  const chainId = getChainId();
  const isLocalnet = chainId === 31337;

  // ########################
  // ### Deploy contracts ###
  // ########################
  // - Deploy GlobalOwner, GlobalPause, GlobalBlacklist
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  await (
    await import("./deploy-GlobalPause")
  ).default;
  await (
    await import("./deploy-GlobalBlacklist")
  ).default;

  // - Deploy APRCheckpoints library
  await (
    await import("./deploy-APRCheckpoints")
  ).default;

  // - (if localnet) Deploy a fake $LDY token
  if (isLocalnet) await deploy("GenericERC20", ["Fake LDY", "LDY", 18]);

  // - Deploy a dummy LDYStaking contract (until real one is available)
  await (
    await import("./deploy-DummyLDYStaking")
  ).default;

  // - (if localnet) Deploy a fake USDC token
  if (isLocalnet) await deploy("GenericERC20", ["Fake USDC", "USDC", 6]);

  // - Deploy L-Tokens contracts
  const LUSDC = await (await import("./deploy-LUSDC")).default;

  // - Deploy LTokenSignaler contract
  await (
    await import("./deploy-LTokenSignaler")
  ).default;

  // - (if localnet) Deploy Multicall3 contract
  if (isLocalnet) await (await import("./deploy-Multicall3")).default;

  // ##############################
  // ### Initialize some states ###
  // ##############################
  // - (if localnet) Set some hardhat account #1 and #2 as fund and withdrawer wallets
  if (isLocalnet) {
    LUSDC!.setFund("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
    LUSDC!.setWithdrawer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
