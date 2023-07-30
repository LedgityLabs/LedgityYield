import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("EUROC");
  const ldyStakingAddress = getContractAddress("LDYStaking");
  return await deployProxy("LEUROC", true, true, true, [underlyingAddress, ldyStakingAddress]);
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
