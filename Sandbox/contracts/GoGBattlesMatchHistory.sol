/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract GoGBattlesMatchHistory is AccessControlUpgradeable {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    event Match(uint256 matchID, address winner, address loser, uint256 timestamp, string ipfs);
    
    address _coordinator;
    uint256 _nextMatchID;
    
    mapping(string => uint256) matchIDLookup;
    mapping(uint256 => string) ipfsLookup;
    
    constructor() {
        __AccessControl_init();
        
        _coordinator = msg.sender;
        _nextMatchID = 1;
        
        
    }
    
    modifier coordinatorOnly {
        require(msg.sender == _coordinator);
        _;
    }
    
    function setOwner(address owner) coordinatorOnly() public {
        _coordinator = owner;
    }
    
    function publishMatch(address winner, address loser, uint256 timestamp, string memory ipfs) coordinatorOnly() public {
        require(matchIDLookup[ipfs] == 0);
        uint256 matchID = _nextMatchID++;
        ipfsLookup[matchID] = ipfs;
        matchIDLookup[ipfs] = matchID;
        emit Match(matchID, winner, loser, timestamp, ipfs);
    }
}