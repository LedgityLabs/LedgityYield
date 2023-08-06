import { deploy } from "./lib/deploy";

const main = async () => await deploy("APRHistory");

export default main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
