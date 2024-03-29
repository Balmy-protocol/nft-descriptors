import { ethers } from 'hardhat';
import { DCAHubPositionDescriptorFixed, DCAHubPositionDescriptorFixed__factory } from '@typechained';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('DCAHubPositionDescriptorFixed', () => {
  let hub: SignerWithAddress;
  let tokenId: number;
  let DCAHubPositionDescriptorFixed: DCAHubPositionDescriptorFixed;
  let chainId: number;

  before('Setup accounts and contracts', async () => {
    tokenId = Math.floor(Math.random() * (10000 - 1));
    const factory = (await ethers.getContractFactory('DCAHubPositionDescriptorFixed')) as DCAHubPositionDescriptorFixed__factory;
    const [signer, _hub] = await ethers.getSigners();
    hub = _hub;
    DCAHubPositionDescriptorFixed = await factory.deploy('baseurl/', signer.address);
    chainId = (await ethers.provider.getNetwork()).chainId;
  });

  describe('tokenURI', () => {
    it('returns the correct url', async () => {
      const baseURL = await DCAHubPositionDescriptorFixed.baseURL();
      const url = await getPositionURI();
      const expectedUrl = baseURL + chainId + '-' + hub.address + '-' + tokenId;
      expect(url.toLowerCase()).to.be.equal(expectedUrl.toLowerCase());
    });
  });
  describe('setBaseURL', () => {
    it('prevents to modify base url', async () => {
      const newBaseURL = 'newurl/';
      const impersonate = await ethers.getSigner('0x8894E0a0c962CB723c1976a4421c95949bE2D4E3');
      await expect(DCAHubPositionDescriptorFixed.connect(impersonate.address).setBaseURL(newBaseURL)).to.be.reverted;
    });

    it('modifies base url', async () => {
      const newBaseURL = 'newurl/';
      await DCAHubPositionDescriptorFixed.setBaseURL(newBaseURL);
      expect(await DCAHubPositionDescriptorFixed.baseURL()).to.be.equal(newBaseURL);
    });
  });

  async function getPositionURI() {
    const result = await DCAHubPositionDescriptorFixed.tokenURI(hub.address, tokenId);
    return result;
  }
});
