// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7 <0.9.0;

import '../../libraries/IntervalUtils.sol';

contract IntervalUtilsMock {
  function intervalToDescription(uint32 _swapInterval) external pure returns (string memory) {
    return IntervalUtils.intervalToDescription(_swapInterval);
  }
}
