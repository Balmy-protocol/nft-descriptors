// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0;
pragma abicoder v2;

import '@openzeppelin/contracts/utils/Strings.sol';

// Based on Uniswap's NFTDescriptor
library DescriptorUtils {
  using Strings for uint256;
  using Strings for uint32;

  function fixedPointToDecimalString(uint256 value, uint8 decimals) internal pure returns (string memory) {
    if (value == 0) {
      return '0.0000';
    }

    bool priceBelow1 = value < 10**decimals;

    // get digit count
    uint256 temp = value;
    uint8 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    // don't count extra digit kept for rounding
    digits = digits - 1;

    // address rounding
    (uint256 sigfigs, bool extraDigit) = _sigfigsRounded(value, digits);
    if (extraDigit) {
      digits++;
    }

    DecimalStringParams memory params;
    if (priceBelow1) {
      // 7 bytes ( "0." and 5 sigfigs) + leading 0's bytes
      params.bufferLength = digits >= 5 ? decimals - digits + 6 : decimals + 2;
      params.zerosStartIndex = 2;
      params.zerosEndIndex = decimals - digits + 1;
      params.sigfigIndex = params.bufferLength - 1;
    } else if (digits >= decimals + 4) {
      // no decimal in price string
      params.bufferLength = digits - decimals + 1;
      params.zerosStartIndex = 5;
      params.zerosEndIndex = params.bufferLength - 1;
      params.sigfigIndex = 4;
    } else {
      // 5 sigfigs surround decimal
      params.bufferLength = 6;
      params.sigfigIndex = 5;
      params.decimalIndex = digits - decimals + 1;
    }
    params.sigfigs = sigfigs;
    params.isLessThanOne = priceBelow1;

    return _generateDecimalString(params);
  }

  function addressToString(address _addr) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint256 i = 0; i < 20; i++) {
      bytes1 b = bytes1(uint8(uint256(uint160(_addr)) / (2**(8 * (19 - i)))));
      bytes1 hi = bytes1(uint8(b) / 16);
      bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
      s[2 * i] = _char(hi);
      s[2 * i + 1] = _char(lo);
    }
    return string(abi.encodePacked('0x', string(s)));
  }

  struct DecimalStringParams {
    // significant figures of decimal
    uint256 sigfigs;
    // length of decimal string
    uint8 bufferLength;
    // ending index for significant figures (funtion works backwards when copying sigfigs)
    uint8 sigfigIndex;
    // index of decimal place (0 if no decimal)
    uint8 decimalIndex;
    // start index for trailing/leading 0's for very small/large numbers
    uint8 zerosStartIndex;
    // end index for trailing/leading 0's for very small/large numbers
    uint8 zerosEndIndex;
    // true if decimal number is less than one
    bool isLessThanOne;
  }

  function _generateDecimalString(DecimalStringParams memory params) private pure returns (string memory) {
    bytes memory buffer = new bytes(params.bufferLength);
    if (params.isLessThanOne) {
      buffer[0] = '0';
      buffer[1] = '.';
    }

    // add leading/trailing 0's
    for (uint256 zerosCursor = params.zerosStartIndex; zerosCursor < params.zerosEndIndex + 1; zerosCursor++) {
      buffer[zerosCursor] = bytes1(uint8(48));
    }
    // add sigfigs
    while (params.sigfigs > 0) {
      if (params.decimalIndex > 0 && params.sigfigIndex == params.decimalIndex) {
        buffer[params.sigfigIndex--] = '.';
      }
      uint8 charIndex = uint8(48 + (params.sigfigs % 10));
      buffer[params.sigfigIndex] = bytes1(charIndex);
      params.sigfigs /= 10;
      if (params.sigfigs > 0) {
        params.sigfigIndex--;
      }
    }
    return string(buffer);
  }

  function _sigfigsRounded(uint256 value, uint8 digits) private pure returns (uint256, bool) {
    bool extraDigit;
    if (digits > 5) {
      value = value / (10**(digits - 5));
    }
    bool roundUp = value % 10 > 4;
    value = value / 10;
    if (roundUp) {
      value = value + 1;
    }
    // 99999 -> 100000 gives an extra sigfig
    if (value == 100000) {
      value /= 10;
      extraDigit = true;
    }
    return (value, extraDigit);
  }

  function _char(bytes1 b) private pure returns (bytes1 c) {
    if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
    else return bytes1(uint8(b) + 0x57);
  }
}
