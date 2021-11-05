// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface Cards is IERC1155 {
    function setGoGBattlesTokenAndCardFactory(address gogBattlesToken, address gogBattlesCardFactory, address gogBattlesVault) external;
    function setURI(string memory newuri) external;
    function mintUnbacked(address to, uint256 cardId) external returns(uint256);
    function mintBatch(address to, uint256[] memory cardIds, uint256[] memory values) external returns(uint256[] memory);
    function mintPack(address to, uint256 tokenAmount) external returns(uint256[] memory, uint256);
    function burnBatch(address owner, uint256[] memory ids, uint256[] memory amounts) external;
    function burnBatch(address owner, uint256[] memory ids) external;
    function backingValueOf(uint[] memory cardIds) external view returns(uint);
    function backingBalanceOf(address user) external view returns(uint);
}

