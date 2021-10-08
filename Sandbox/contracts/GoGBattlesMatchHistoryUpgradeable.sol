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
contract GoGBattlesMatchHistoryUpgradeable is AccessControlUpgradeable {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    event Match(uint256 matchID, address winner, address loser, uint256 timestamp, string ipfs);
    
    address _coordinator;
    uint256 _nextMatchID;
    
    mapping(string => uint256) matchIDLookup;
    mapping(uint256 => string) ipfsLookup;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {}

    function initialize() initializer public {
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
        
        _nextMatchID = 1;
    }
    
    function publishMatch(address winner, address loser, uint256 timestamp, string memory ipfs) onlyRole(COORDINATOR_ROLE) public {
        require(matchIDLookup[ipfs] == 0);
        uint256 matchID = _nextMatchID++;
        ipfsLookup[matchID] = ipfs;
        matchIDLookup[ipfs] = matchID;
        emit Match(matchID, winner, loser, timestamp, ipfs);
    }
}