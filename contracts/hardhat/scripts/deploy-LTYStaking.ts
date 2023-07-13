import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const ltyAddress = getContractAddress("LTY");
  return await deployProxy("LTYStaking", true, true, true, [ltyAddress]);
}

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
