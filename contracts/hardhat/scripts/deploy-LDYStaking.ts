import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const ldyAddress = getContractAddress("LDY");
  const aprCheckpointsAddress = getContractAddress("APRCheckpoints");
  return await deployProxy("LDYStaking", true, true, true, [ldyAddress], {
    APRCheckpoints: aprCheckpointsAddress,
  });
};

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
