import { DeployFunction } from '@0xged/hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { bytecode } from '../artifacts/solidity/contracts/DCAHubPositionDescriptorFixed.sol/DCAHubPositionDescriptorFixed.json';
import { deployThroughDeterministicFactory } from '@mean-finance/deterministic-factory/utils/deployment';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  let msig: string | undefined;
  switch (hre.deployments.getNetworkName().toLowerCase()) {
    case 'ethereum': // Ethereum
      msig = '0xEC864BE26084ba3bbF3cAAcF8F6961A9263319C4';
      break;
    case 'optimism': // Optimism
      msig = '0x308810881807189cAe91950888b2cB73A1CC5920';
      break;
    case 'polygon': // Polygon
      msig = '0xCe9F6991b48970d6c9Ef99Fffb112359584488e3';
      break;
    case 'arbitrum': // Arbitrum
      msig = '0x84F4836e8022765Af9FBCE3Bb2887fD826c668f1';
      break;
    case 'bnb': // BNB
      msig = '0x10a5D3b1C0F3639CfB0E554F29c3eFFD912d0C64';
      break;
    case 'base-goerli': // Base Goerli
      msig = '0xD5b9C9c14b3a535C41D385007309DB5d0a6cF57c';
      break;
    case 'base': // Base
      msig = '0x58EDd2E9bCC7eFa5205d5a73Efa160A05dbAC95D';
      break;
    case 'gnosis': // Gnosis
      msig = '0xFD7598B46aC9e7B9201B06FF014F22085e155B60';
      break;
    case 'fuse': // Fuse
      msig = '0x5C4fE9D48b6B8938206B47343329572064fdebe2';
      break;
    case 'moonbeam': // Moonbeam
      msig = '0xa1667E34fc9a602C38E19246176D28831c5794EB';
      break;
    case 'celo': // Celo
      msig = '0x94F96A6A7bF34e85bfdfeE13987001CAE3A47EEB';
      break;
    case 'avalanche': // Avalanche
      msig = '0xcD736597565fcdcF85cb9f0b6759bF2E4eab38D2';
      break;
    case 'linea': // Linea
      msig = '0xfCCCba57aa4a51026E3b50ecB377Fc7382aCD9E2';
      break;
    case 'rootstock': // Rootstock
      msig = '0x26d249089b2849bb0643405A9003f35824fA1f24';
      break;
  }

  if (!msig) return;
  const baseUrl = 'https://api.balmy.xyz/v2/dca/metadata/';
  await deployThroughDeterministicFactory({
    deployer,
    name: 'DCAHubPositionDescriptorFixed',
    salt: 'MF-DCAHubPositionDescriptorFixed-V1',
    contract: 'solidity/contracts/DCAHubPositionDescriptorFixed.sol:DCAHubPositionDescriptorFixed',
    bytecode,
    constructorArgs: {
      types: ['string', 'address'],
      values: [baseUrl, msig],
    },
    log: !process.env.TEST,
    overrides: {
      gasLimit: 5_800_000,
    },
  });
};

deployFunction.tags = ['DCAHubPositionDescriptorFixed'];
export default deployFunction;
