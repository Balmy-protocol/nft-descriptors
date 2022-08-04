import { utils } from 'ethers';
import { ethers } from 'hardhat';
import { IDCAHub, DCAHubPositionDescriptor, DCAHubPositionDescriptor__factory, IERC20Metadata } from '@typechained';
import isSvg from 'is-svg';
import chai, { expect } from 'chai';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { given, then, when } from '@utils/bdd';

chai.use(smock.matchers);

describe('DCAHubPositionDescriptor', () => {
  let fromToken: FakeContract<IERC20Metadata>, toToken: FakeContract<IERC20Metadata>;
  let hub: FakeContract<IDCAHub>;
  let DCAHubPositionDescriptor: DCAHubPositionDescriptor;
  const SWAP_INTERVAL = 60 * 60 * 24; // 1 day

  before('Setup accounts and contracts', async () => {
    fromToken = await smock.fake('IERC20Metadata');
    toToken = await smock.fake('IERC20Metadata');
    hub = await smock.fake('IDCAHub');
    const factory = (await ethers.getContractFactory('DCAHubPositionDescriptor')) as DCAHubPositionDescriptor__factory;
    DCAHubPositionDescriptor = await factory.deploy();

    fromToken.decimals.returns(18);
    fromToken.name.returns('tokenA');
    fromToken.symbol.returns('TKNA');
    toToken.decimals.returns(18);
    toToken.name.returns('tokenB');
    toToken.symbol.returns('TKNB');
  });

  tokenURITest({
    when: 'position has no executed swaps',
    swapsExecuted: 0,
    swapsLeft: 2,
  });

  tokenURITest({
    when: 'position has 50% of swaps executed',
    swapsExecuted: 1,
    swapsLeft: 1,
  });

  tokenURITest({
    when: 'position has 100% of swaps executed',
    swapsExecuted: 2,
    swapsLeft: 0,
  });

  tokenURITest({
    when: 'position is cleared',
    swapsExecuted: 0,
    swapsLeft: 0,
  });

  function tokenURITest({ when: title, swapsExecuted, swapsLeft }: { when: string; swapsExecuted: number; swapsLeft: number }) {
    when(title, () => {
      let name: string, description: string, image: string;
      given(async () => {
        setPositionState({ swapsExecuted, swapsLeft });
        ({ name, description, image } = await getPositionURI());
      });
      then('name is as expected', () => {
        expect(name).to.equal('Mean Finance DCA - Daily - TKNA ➔ TKNB');
      });
      then('description is as expected', () => {
        expect(description).to.equal(
          `This NFT represents a DCA position in Mean Finance, where TKNA will be swapped for TKNB. The owner of this NFT can modify or redeem the position.\n\nTKNA Address: ${fromToken.address.toLowerCase()}\nTKNB Address: ${toToken.address.toLowerCase()}\nSwap interval: Daily\nToken ID: 1\n\n⚠️ DISCLAIMER: Due diligence is imperative when assessing this NFT. Make sure token addresses match the expected tokens, as token symbols may be imitated.`
        );
      });
      then('svg is valid', () => {
        console.log(image);
        expect(isValidSvgImage(image)).to.be.true;
      });
    });
  }

  function setPositionState({ swapsExecuted, swapsLeft }: { swapsExecuted: number; swapsLeft: number }) {
    const rate = utils.parseEther('20');
    hub.userPosition.returns({
      from: fromToken.address,
      to: toToken.address,
      swapInterval: SWAP_INTERVAL,
      rate,
      swapsExecuted,
      swapsLeft,
      swapped: rate.mul(swapsExecuted),
      remaining: rate.mul(swapsLeft),
    });
  }

  async function getPositionURI() {
    const result = await DCAHubPositionDescriptor.tokenURI(hub.address, 1);
    expect(hub.userPosition).to.have.been.calledOnceWith(1);
    hub.userPosition.reset();
    return extractJSONFromURI(result);
  }

  function isValidSvgImage(base64: string) {
    const encodedImage = base64.substring('data:image/svg+xml;base64,'.length);
    const decodedImage = Buffer.from(encodedImage, 'base64').toString('utf8');
    return isSvg(decodedImage);
  }

  function extractJSONFromURI(uri: string): { name: string; description: string; image: string } {
    const encodedJSON = uri.substring('data:application/json;base64,'.length);
    const decodedJSON = Buffer.from(encodedJSON, 'base64').toString('utf8');
    return JSON.parse(decodedJSON);
  }
});
