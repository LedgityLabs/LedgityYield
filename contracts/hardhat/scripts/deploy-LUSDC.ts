import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("USDC");
  const ldyStakingAddress = getContractAddress("LDYStaking");
  const aprCheckpointsAddress = getContractAddress("APRHistory");
  return await deployProxy("LUSDC", true, true, true, [ldyStakingAddress, underlyingAddress], {
    APRHistory: aprCheckpointsAddress,
  });
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
