export const main = async () => {
  await (
    await import("./deploy-GlobalOwner")
  ).default;
  await (
    await import("./deploy-GlobalPauser")
  ).default;
  await (
    await import("./deploy-GlobalBlacklist")
  ).default;
  await (
    await import("./deploy-LTY")
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
