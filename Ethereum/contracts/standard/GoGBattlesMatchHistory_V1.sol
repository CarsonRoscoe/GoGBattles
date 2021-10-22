/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/MatchHistory.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract GoGBattlesMatchHistory_V1 is MatchHistory, AccessControl {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    uint256 _nextMatchID;
    
    mapping(string => uint256) matchIDLookup;
    mapping(uint256 => string) ipfsLookup;
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
        
        _nextMatchID = 1;
    }
    
    function publishMatch(address winner, address loser, uint256 timestamp, string memory ipfs) onlyRole(COORDINATOR_ROLE) public override {
        require(matchIDLookup[ipfs] == 0);
        uint256 matchID = _nextMatchID++;
        ipfsLookup[matchID] = ipfs;
        matchIDLookup[ipfs] = matchID;
        emit Match(matchID, winner, loser, timestamp, ipfs);
    }
}