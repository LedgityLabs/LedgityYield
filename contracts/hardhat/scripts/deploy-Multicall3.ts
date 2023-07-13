import { deploy } from "./lib/deploy";

const main = async () => await deploy("Multicall3");

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
