import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("EUROC");
  const ltyStakingAddress = getContractAddress("LTYStaking");
  return await deployProxy("LEUROC", true, true, true, [underlyingAddress, ltyStakingAddress]);
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
