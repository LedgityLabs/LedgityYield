import { deployBeacon } from "./lib/deployBeacon";

const main = async () => await deployBeacon("LToken");

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
