// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

interface MatchHistory {
    event Match(uint256 matchID, address winner, address loser, uint256 timestamp, string ipfs);
    function publishMatch(address winner, address loser, uint256 timestamp, string memory ipfs) external;
}