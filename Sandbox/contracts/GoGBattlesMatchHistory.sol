/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract GoGBattlesMatchHistory {
    event Match(uint256 matchID, address winner, address loser, uint256 timestamp, string ipfs);
    
    address _owner;
    uint256 _nextMatchID;
    
    mapping(string => uint256) matchIDLookup;
    mapping(uint256 => string) ipfsLookup;
    
    constructor() {
        _owner = msg.sender;
        _nextMatchID = 1;
    }
    
    modifier ownerOnly {
        require(msg.sender == _owner);
        _;
    }
    
    function setOwner(address owner) ownerOnly() public {
        
    }
    
    function publishMatch(address winner, address loser, uint256 timestamp, string memory ipfs) ownerOnly() public {
        require(matchIDLookup[ipfs] == 0);
        uint256 matchID = _nextMatchID++;
        ipfsLookup[matchID] = ipfs;
        matchIDLookup[ipfs] = matchID;
        emit Match(matchID, winner, loser, timestamp, ipfs);
    }
}