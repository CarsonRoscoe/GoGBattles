// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract GoGBattlesCardFactory {
    mapping(uint => uint) _cardValues;
    uint _nextCardId;
    
    function registerCard(uint cardValue) public returns(uint256) {
        uint cardId = _nextCardId++;
        _cardValues[cardId] = cardValue;
        return cardId;
    }
    
    function rollCards(uint256 availableBacking) public returns (uint256[] memory, uint256[] memory, uint256) {
        uint256[] memory cardIds;
        uint256[] memory cardValues;
        uint256 remainingToken;
        return (cardIds, cardValues, remainingToken);
    }
}