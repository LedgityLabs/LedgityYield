import { parseUnits } from "viem";

export const main = async () => {
  // Deploy contracts
  const blacklist = await (await import("./deploy-Blacklist")).default;
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
  lty!.setBlacklist(await blacklist!.getAddress());

  // Initialize LTYStaking contract data
  ltyStaking!.setBlacklist(await blacklist!.getAddress());
  ltyStaking!.setInvested(await lty!.getAddress());
  ltyStaking!.setAPR(parseUnits("20", 3));

  ltyStaking!.setTier(1, 0);
  ltyStaking!.setTier(2, parseUnits("2000000", 18));
  ltyStaking!.setTier(3, parseUnits("10000000", 18));

  // Initialize L-Tokens contracts data
  for (let lToken of lTokens) {
    lToken!.setBlacklist(await blacklist!.getAddress());
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
