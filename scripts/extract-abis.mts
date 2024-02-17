/** TheGraph YAML file requires ABI to be available as top level files (not nested in
 * deployments.json), this script extracts ABIs from hardhat artifacts folder into
 * individual files under contracts/abis/ folder.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath ,pathToFileURL} from 'url';
import { dirname } from 'path';

// For cross-platform compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDirectory = path.join(__dirname, "../contracts/hardhat/artifacts/contracts/src");
const destinationDirectory = path.join(__dirname, "../contracts/abis");

// Ensure 'contracts/abis/' directory exists or create it.
if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory, { recursive: true });
}

const extractABIsFromDirectory = async (directory: string) => {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      extractABIsFromDirectory(filePath);
    } else if (filePath.endsWith(".json") && !filePath.endsWith(".dbg.json")) {
     const fileURL = pathToFileURL(filePath);

      // Dynamic import using the URL format
    const contractData = await import(fileURL.href, { assert: { type: 'json' } });
      const contractName = path.basename(filePath, ".json");

      if (contractData.default.abi && contractData.default.abi.length > 0) {
        fs.writeFileSync(
          path.join(destinationDirectory, `${contractName}.json`),
          JSON.stringify(contractData.default.abi, null, 2),
        );
      } else {
        console.log(`No ABI found for ${contractName}`);
      }
    }
  }
};

await extractABIsFromDirectory(sourceDirectory);
console.log("ABIs extracted successfully!");
