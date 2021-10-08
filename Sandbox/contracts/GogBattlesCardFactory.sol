// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract GoGBattlesCardFactory is AccessControl {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    bytes32 public constant CARD_REGISTERER_ROLE = keccak256("CARD_REGISTERER_ROLE");
    mapping(uint => uint) _cardValues;
    uint _nextCardId;
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
        _setupRole(CARD_REGISTERER_ROLE, msg.sender);
    }

    function registerCard(uint cardValue) public onlyRole(CARD_REGISTERER_ROLE) returns(uint256) {
        uint cardId = _nextCardId++;
        _cardValues[cardId] = cardValue;
        return cardId;
    }
    
    function rollCards(uint256 availableBacking) public view returns (uint256[] memory, uint256[] memory, uint256) {
        uint256[] memory cardIds;
        uint256[] memory cardValues;
        uint256 remainingToken;
        return (cardIds, cardValues, remainingToken);
    }
}