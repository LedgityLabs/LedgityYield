import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("USDC");
  const ldyStakingAddress = getContractAddress("LDYStaking");
  return await deployProxy("LUSDC", true, true, true, [underlyingAddress, ldyStakingAddress]);
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
