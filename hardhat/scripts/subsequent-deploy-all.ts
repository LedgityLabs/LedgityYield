export const main = async () => {
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  await (
    await import("./deploy-GlobalPause")
  ).default;
  await (
    await import("./deploy-GlobalBlacklist")
  ).default;
  await (
    await import("./deploy-LTYStaking")
  ).default;
  await (
    await import("./deploy-LToken")
  ).default;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
