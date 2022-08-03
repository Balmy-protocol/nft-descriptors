// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7 <0.9.0;

import '../../libraries/DescriptorUtils.sol';

contract DescriptorUtilsMock {
  function fixedPointToDecimalString(uint256 value, uint8 decimals) external pure returns (string memory) {
    return DescriptorUtils.fixedPointToDecimalString(value, decimals);
  }

  function addressToString(address _addr) external pure returns (string memory) {
    return DescriptorUtils.addressToString(_addr);
  }
}
