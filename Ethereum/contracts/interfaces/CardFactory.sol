// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface CardFactory {
    function registerCards(uint[] memory cardValues, uint[] memory rollChances) external returns(uint256[] memory);
    function registerCard(uint cardValue, uint rollChance) external returns(uint256);
    function rollCards(uint256 availableBacking) external returns (uint256[] memory, uint256[] memory, uint256);
}