import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const ldyAddress = getContractAddress("LDY");
  return await deployProxy("LDYStaking", true, true, true, [ldyAddress]);
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
