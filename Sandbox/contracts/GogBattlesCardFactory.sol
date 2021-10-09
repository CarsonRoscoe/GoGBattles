// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";


contract GoGBattlesCardFactory {
    uint[] _cardValues;
    uint[] _cardRollChances;
    uint _smallestCardValue;
    
    uint _cardCatalogIndexIndex;
    uint[4] _cardCatalogIndexes;
    
    constructor() {
        registerCard(100, 100);
        registerCard(1000, 1000);
        registerCard(100000, 100000);
        registerCard(10000000, 10000000);
    }
    
    function registerCards(uint[] memory cardValues, uint[] memory rollChances) public returns(uint256[] memory) {
        require(cardValues.length == rollChances.length);
        uint[] memory result = new uint[](cardValues.length);
        for(uint i = 0; i < cardValues.length; ++i) {
            uint cardValue = cardValues[i];
            uint rollChance = rollChances[i];
            
            _cardValues.push(cardValue);
            _cardRollChances.push(rollChance);
            
            if (_cardValues.length == 0 || cardValue < _smallestCardValue) {
                _smallestCardValue = cardValue;
            }
            result[i] = _cardValues.length - 1;
        }
        
        
        uint quarter = (_cardValues.length - 1) / 4;
        _cardCatalogIndexes[1] = quarter;
        _cardCatalogIndexes[2] = quarter * 2;
        _cardCatalogIndexes[3] = quarter * 3;
        _updateCardCatalogIndex();
        
        return result;
    }
    
    function registerCard(uint cardValue, uint rollChance) public returns(uint256) {
        _cardValues.push(cardValue);
        _cardRollChances.push(rollChance);
        if (_cardValues.length == 0 || cardValue < _smallestCardValue) {
            _smallestCardValue = cardValue;
        }
        
        uint quarter = (_cardValues.length - 1) / 4;
        _cardCatalogIndexes = [0, quarter, quarter * 2, quarter * 3];
        _updateCardCatalogIndex();
        
        return _cardValues.length - 1;
    }
    
    function rollCards(uint256 availableBacking) public returns (uint256[] memory, uint256[] memory, uint256) {
        uint256 tokensLeft = availableBacking;
        uint tokensAwarded = 0;
        
        uint256[] memory cardIds = new uint256[](20);
        uint256[] memory cardValues = new uint256[](20);
        
        for(uint i = 0; i < 20 && tokensLeft > 0; ++i){
             if (tokensLeft < _smallestCardValue) {
                tokensAwarded += tokensLeft;
                tokensLeft = 0;
                break;
            }
            
            (uint cardId, uint cardValue) = _rollFromCardList(tokensLeft);
            if (cardId == 0 && cardValue == 0){
                i--;
                continue;
            }
            
            cardIds[i] = cardId;
            cardValues[i] = cardValue;
            tokensLeft -= cardValue;
        }
        
        return (cardIds, cardValues, tokensLeft);
    }
    
    function _rollFromCardList(uint amount) private returns(uint cardId, uint cardValue) {
        uint count;
        
        while(count < 20) {
            uint seed = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender, count)));
            
            uint cardId = _cardCatalogIndexes[_cardCatalogIndexIndex];
            uint cardValue = _cardValues[cardId];
            uint cardRollChance = _cardRollChances[cardId];
            
            _updateCardCatalogIndex();
        
            //Check if they deposited enough tokens to earn this card.
            if (cardValue <= amount) {
                return (cardId, cardValue);
                int random = int(seed / 8.0) / int(2e32);
                int roll = random * int(cardRollChance);
                if (roll <= int(((cardRollChance / 2 < amount) ? cardRollChance / 2 : amount )/2 - 1)) {
                    return (cardId, cardValue);
                } 
            }
            
            count++;
        }
    }

    function _updateCardCatalogIndex() private returns(uint) {
        _cardCatalogIndexes[_cardCatalogIndexIndex] = (_cardCatalogIndexes[_cardCatalogIndexIndex] + 1) % _cardValues.length;
        _cardCatalogIndexIndex = (_cardCatalogIndexIndex + 3) % _cardCatalogIndexes.length;
    }
}