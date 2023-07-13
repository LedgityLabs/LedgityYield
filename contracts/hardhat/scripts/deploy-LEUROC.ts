import { deployProxy } from "./lib/deployProxy";
import { getContractAddress } from "./lib/getContractAddress";

const main = async () => {
  const underlyingAddress = getContractAddress("EUROC");
  return await deployProxy("LEUROC", true, true, true, [underlyingAddress]);
}

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
