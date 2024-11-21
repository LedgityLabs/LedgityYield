// extract-abis.mjs
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDirectory = path.join(__dirname, "../contracts/hardhat/artifacts/contracts/src");
const destinationDirectory = path.join(__dirname, "../contracts/abis");

if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory, { recursive: true });
}

const extractABIsFromDirectory = async (directory) => {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await extractABIsFromDirectory(filePath);
    } else if (filePath.endsWith(".json") && !filePath.endsWith(".dbg.json")) {
      const contractData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const contractName = path.basename(filePath, ".json");
      if (contractData.abi && contractData.abi.length > 0) {
        fs.writeFileSync(
          path.join(destinationDirectory, `${contractName}.json`),
          JSON.stringify(contractData.abi, null, 2),
        );
      } else {
        console.log(`No ABI found for ${contractName}`);
      }
    }
  }
};

(async () => {
  try {
    await extractABIsFromDirectory(sourceDirectory);
    console.log("ABIs extracted successfully!");
  } catch (error) {
    console.error("Error extracting ABIs:", error);
    process.exit(1);
  }
})();