// all_deploy.ts
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// List of deployment script modules to run, in order
const deploymentScripts: string[] = [
  './contracts/hardhat/deploy/01-GlobalOwner',
  './contracts/hardhat/deploy/02-GlobalPause',
  './contracts/hardhat/deploy/03-GlobalBlacklist',
  './contracts/hardhat/deploy/04-APRHistory',
  './contracts/hardhat/deploy/05-LDYStaking',
  './contracts/hardhat/deploy/06-LUSDC',
  './contracts/hardhat/deploy/07-LTokenSignaler',
  './contracts/hardhat/deploy/08-Multicall3',
  './contracts/hardhat/deploy/09-PreMining',
  // Add paths to more scripts as needed, without file extension
];

const allDeploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  for (const scriptPath of deploymentScripts) {
    console.log(`Running deployment script: ${scriptPath}`);
    const script: DeployFunction = (await import(scriptPath)).default;
    await script(hre);
  }
};

export default allDeploy;
allDeploy.tags = ['all'];