import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("USDC");
  const ltyStakingAddress = getContractAddress("LTYStaking");
  return await deployProxy("LUSDC", true, true, true, [underlyingAddress, ltyStakingAddress]);
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
