import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("EUROC");
  const ldyStakingAddress = getContractAddress("LDYStaking");
  const aprCheckpointsAddress = getContractAddress("APRCheckpoints");

  return await deployProxy("LEUROC", true, true, true, [ldyStakingAddress, underlyingAddress], {
    APRCheckpoints: aprCheckpointsAddress,
  });
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
