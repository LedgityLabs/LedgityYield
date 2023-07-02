import { deployProxy } from "./lib/deployProxy";

const main = async () => await deployProxy("LTY");

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
