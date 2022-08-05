import { DeployFunction } from '@0xged/hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { bytecode } from '../artifacts/solidity/contracts/DCAHubPositionDescriptor.sol/DCAHubPositionDescriptor.json';
import { deployThroughDeterministicFactory } from '@mean-finance/deterministic-factory/utils/deployment';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  await deployThroughDeterministicFactory({
    deployer,
    name: 'DCAHubPositionDescriptor',
    salt: 'MF-DCAHubPositionDescriptor-V1',
    contract: 'solidity/contracts/DCAHubPositionDescriptor.sol:DCAHubPositionDescriptor',
    bytecode,
    constructorArgs: {
      types: [],
      values: [],
    },
    log: !process.env.TEST,
    overrides: {
      gasLimit: 5_800_000,
    },
  });
};

deployFunction.tags = ['DCAHubPositionDescriptor'];
export default deployFunction;
