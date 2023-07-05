const fs = require("fs");
const path = require("path");

const extractAbi = async () => {
  const mainFolder = path.join(__dirname, "./artifacts/hardhat/contracts/");
  const abisFolder = path.join(__dirname, "./abis/");
  fs.readdirSync(mainFolder).forEach((folder: string) => {
    if (folder.includes(".sol")) {
      const absolutePath = mainFolder + folder + "/";

      fs.readdirSync(absolutePath).forEach((file: any) => {
        if (!file.includes(".dbg.json")) {
          const finalPath = absolutePath + file;
          const parentDirectory = __dirname.substr(0, __dirname.lastIndexOf("/"));
          const abiFolder = parentDirectory + "/abis";

          try {
            if (!fs.existsSync(abiFolder)) {
              fs.mkdirSync(abiFolder);
            }
          } catch (err) {
            console.error(err);
          }

          let data: any = fs.readFileSync(finalPath);

          fs.writeFileSync(`${abisFolder}${file}`, JSON.stringify(JSON.parse(data).abi));
        }
      });
    }
  });
};
extractAbi();
