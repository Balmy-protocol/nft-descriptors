import { utils } from 'ethers';
import { ethers, network } from 'hardhat';
import { IDCAPositionGetter, DCAHubPositionDescriptorFixed, DCAHubPositionDescriptorFixed__factory, IERC20Metadata } from '@typechained';
import chai, { expect } from 'chai';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { given, then, when } from '@utils/bdd';

chai.use(smock.matchers);

describe('DCAHubPositionDescriptorFixed', () => {
  let hub: FakeContract<IDCAPositionGetter>;
  let tokenId: number;
  let DCAHubPositionDescriptorFixed: DCAHubPositionDescriptorFixed;

  before('Setup accounts and contracts', async () => {
    hub = await smock.fake('IDCAPositionGetter');
    tokenId = Math.floor(Math.random() * (10000 - 1));
    const factory = (await ethers.getContractFactory('DCAHubPositionDescriptorFixed')) as DCAHubPositionDescriptorFixed__factory;
    const [signer] = await ethers.getSigners();
    DCAHubPositionDescriptorFixed = await factory.deploy(signer.address);
  });

  describe('tokenURI', () => {
    it('returns the correct url', async () => {
      const baseURL = await DCAHubPositionDescriptorFixed.baseURL();
      const url = await getPositionURI();
      const chainId = 31337;
      const expectedUrl = baseURL + chainId + '-' + hub.address + '-' + tokenId;
      expect(url.toLowerCase()).to.be.equal(expectedUrl.toLowerCase());
    });
  });
  describe('setBaseURL', () => {
    it('prevents to modify base url', async () => {
      const oldBaseURL = await DCAHubPositionDescriptorFixed.baseURL();
      const newBaseURL = 'newurl/';

      const impersonate = await ethers.getSigner('0x8894E0a0c962CB723c1976a4421c95949bE2D4E3');

      expect(DCAHubPositionDescriptorFixed.connect(impersonate.address).setBaseURL(newBaseURL)).to.be.reverted;
      expect(await DCAHubPositionDescriptorFixed.baseURL()).to.be.equal(oldBaseURL);
      expect(await DCAHubPositionDescriptorFixed.baseURL()).not.to.be.equal(newBaseURL);
    });

    it('modifies base url', async () => {
      const oldBaseURL = await DCAHubPositionDescriptorFixed.baseURL();
      const newBaseURL = 'newurl/';

      await DCAHubPositionDescriptorFixed.setBaseURL(newBaseURL);
      expect(await DCAHubPositionDescriptorFixed.baseURL()).to.be.equal(newBaseURL);
      expect(await DCAHubPositionDescriptorFixed.baseURL()).not.to.be.equal(oldBaseURL);
    });
  });

  async function getPositionURI() {
    const result = await DCAHubPositionDescriptorFixed.tokenURI(hub.address, tokenId);
    return result;
  }
});
