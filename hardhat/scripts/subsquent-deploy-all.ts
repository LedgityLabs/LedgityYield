// import { main as deployBlacklist } from "./deploy-Blacklist";
// import { main as deployLToken } from "./deploy-LToken";
// import { main as deployLTYStaking } from "./deploy-LTYStaking";
// import { main as deployLUSDC } from "./deploy-LUSDC";
// import { main as deployLEUROC } from "./deploy-LEUROC";
export const main = async () => {
  await (
    await import("./deploy-Blacklist")
  ).default;

  await (
    await import("./deploy-LTYStaking")
  ).default;

  await (
    await import("./deploy-LToken")
  ).default;
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
