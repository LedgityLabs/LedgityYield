import { deployBeacon } from "./lib/deployBeacon";

const main = async () => await deployBeacon("LToken");

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
