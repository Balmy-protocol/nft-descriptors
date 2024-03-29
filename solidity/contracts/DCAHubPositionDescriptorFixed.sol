// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.16;
import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '../interfaces/IDCAHubPositionDescriptor.sol';
import '../libraries/DescriptorUtils.sol';

/// @title Describes NFT token positions
/// @notice Produces a string containing the URL for the NFT
contract DCAHubPositionDescriptorFixed is IDCAHubPositionDescriptor, Ownable2Step {
  using Strings for uint256;

  string public baseURL;

  constructor(string memory _baseURL, address _firstOwner) {
    baseURL = _baseURL;
    super._transferOwnership(_firstOwner);
  }

  /// @inheritdoc IDCAHubPositionDescriptor
  function tokenURI(address _hub, uint256 _tokenId) external view returns (string memory) {
    return string(abi.encodePacked(baseURL, block.chainid.toString(), '-', DescriptorUtils.addressToString(_hub), '-', _tokenId.toString()));
  }

  function setBaseURL(string memory _newBaseURL) external onlyOwner {
    baseURL = _newBaseURL;
  }
}
