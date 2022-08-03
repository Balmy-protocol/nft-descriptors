import { ethers } from 'hardhat';
import { IntervalUtilsMock__factory, IntervalUtilsMock } from '@typechained';
import { then, when } from '@utils/bdd';
import { expect } from 'chai';

describe('IntervalUtils', () => {
  const ONE_MINUTE = 60;
  const FIVE_MINUTES = ONE_MINUTE * 5;
  const FIFTEEN_MINUTES = FIVE_MINUTES * 3;
  const THIRTY_MINUTES = FIFTEEN_MINUTES * 2;
  const ONE_HOUR = THIRTY_MINUTES * 2;
  const FOUR_HOURS = ONE_HOUR * 4;
  const ONE_DAY = FOUR_HOURS * 6;
  const ONE_WEEK = ONE_DAY * 7;

  const INTERVALS = [ONE_MINUTE, FIVE_MINUTES, FIFTEEN_MINUTES, THIRTY_MINUTES, ONE_HOUR, FOUR_HOURS, ONE_DAY, ONE_WEEK];

  const SWAP_INTERVALS_DESCRIPTIONS = [
    'Every minute',
    'Every 5 minutes',
    'Every 15 minutes',
    'Every 30 minutes',
    'Hourly',
    'Every 4 hours',
    'Daily',
    'Weekly',
  ];
  let intervalUtils: IntervalUtilsMock;

  before('Setup accounts and contracts', async () => {
    const factory = (await ethers.getContractFactory('IntervalUtilsMock')) as IntervalUtilsMock__factory;
    intervalUtils = await factory.deploy();
  });

  describe('intervalToDescription', () => {
    when('calling intervalToDescription with an invalid interval', () => {
      then('reverts with message', async () => {
        await expect(intervalUtils.intervalToDescription(0)).to.have.revertedWithCustomError(intervalUtils, 'InvalidInterval');
      });
    });

    when('calling intervalToDescription with a valid interval', () => {
      then('result is returned correctly', async () => {
        for (let i = 0; i < INTERVALS.length; i++) {
          const interval = INTERVALS[i];
          expect(await intervalUtils.intervalToDescription(interval)).to.equal(SWAP_INTERVALS_DESCRIPTIONS[i]);
        }
      });
    });
  });
});
