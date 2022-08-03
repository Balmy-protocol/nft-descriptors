// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.7 <0.9.0;

import '../../libraries/DescriptorUtils.sol';

contract DescriptorUtilsMock {
  function fixedPointToDecimalString(uint256 _value, uint8 _decimals) external pure returns (string memory) {
    return DescriptorUtils.fixedPointToDecimalString(_value, _decimals);
  }

  function addressToString(address _addr) external pure returns (string memory) {
    return DescriptorUtils.addressToString(_addr);
  }
}
