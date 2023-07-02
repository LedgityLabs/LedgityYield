import { parseUnits } from "viem";

export const main = async () => {
  // Deploy contracts
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  const globalPauser = await (await import("./deploy-GlobalPauser")).default;
  const globalBlacklist = await (await import("./deploy-GlobalBlacklist")).default;
  const lty = await (await import("./deploy-LTY")).default;
  const ltyStaking = await (await import("./deploy-LTYStaking")).default;
  await (
    await import("./deploy-LToken")
  ).default;
  let lTokens = [
    await (await import("./deploy-LUSDC")).default,
    await (await import("./deploy-LEUROC")).default,
  ];
  await (
    await import("./deploy-Multicall3")
  ).default;

  // Initialize LTY contract data
  lty!.setGlobalPauser(await globalPauser!.getAddress());
  lty!.setGlobalBlacklist(await globalBlacklist!.getAddress());

  // Initialize LTYStaking contract data
  ltyStaking!.setGlobalPauser(await globalPauser!.getAddress());
  ltyStaking!.setGlobalBlacklist(await globalBlacklist!.getAddress());
  ltyStaking!.setInvested(await lty!.getAddress());
  ltyStaking!.setAPR(parseUnits("20", 3));
  ltyStaking!.setTier(1, 0);
  ltyStaking!.setTier(2, parseUnits("2000000", 18));
  ltyStaking!.setTier(3, parseUnits("10000000", 18));

  // Initialize L-Tokens contracts data
  for (let lToken of lTokens) {
    lToken!.setGlobalPauser(await globalPauser!.getAddress());
    lToken!.setGlobalBlacklist(await globalBlacklist!.getAddress());
    lToken!.setLTYStaking(await ltyStaking!.getAddress());
    lToken!.setAPR(0);
    lToken!.setFeesRate(0);
    lToken!.setRetentionRate(5000);
    lToken!.setFund("0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
    lToken!.setWithdrawer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
