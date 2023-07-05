import { parseUnits } from "viem";
import { testnetIds } from "../deployments";
import { getChainId } from "./lib/getChainId";
import { deploy } from "./lib/deploy";
import { getContractAddress } from "./lib/getContractAddress";

export const main = async () => {
  // Retrieve current chainId and whether this is a testnet
  const chainId = getChainId();
  const isTestnet = testnetIds.includes(chainId);

  // Deploy contracts
  // If testnet, deploy a fake $LTY token
  if (isTestnet) await deploy("GenericERC20", ["Fake LTY", "LTY", 18]);
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  const globalPauser = await (await import("./deploy-GlobalPauser")).default;
  const globalBlacklist = await (await import("./deploy-GlobalBlacklist")).default;
  const ltyStaking = await (await import("./deploy-LTYStaking")).default;
  await (
    await import("./deploy-LToken")
  ).default;
  // If testnet, deploy a fake $USDC and $EUROC tokens
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

  // Initialize LTYStaking contract data
  const ltyAddress = getContractAddress("LTY");
  ltyStaking!.setGlobalPauser(await globalPauser!.getAddress());
  ltyStaking!.setGlobalBlacklist(await globalBlacklist!.getAddress());
  ltyStaking!.setInvested(ltyAddress);
  ltyStaking!.setAPR(parseUnits("20", 3));
  ltyStaking!.setTier(1, 0);
  ltyStaking!.setTier(2, parseUnits("2000000", 18));
  ltyStaking!.setTier(3, parseUnits("10000000", 18));

  // Initialize L-Tokens contracts data
  for (let lToken of lTokens) {
    lToken!.setGlobalPauser(await globalPauser!.getAddress());
    lToken!.setGlobalBlacklist(await globalBlacklist!.getAddress());
    lToken!.setLTYStaking(await ltyStaking!.getAddress());
    lToken!.setAPR(5000);
    lToken!.setFeesRate(300);
    lToken!.setRetentionRate(5000);
    lToken!.setFund("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
    lToken!.setWithdrawer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
