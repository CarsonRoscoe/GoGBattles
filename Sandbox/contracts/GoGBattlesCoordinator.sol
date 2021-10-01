/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract GoGBattlesCoordinator {
    address _owner;
    address _erc20;
    mapping(address => bool) _stables;
    
    constructor(address erc20) {
        _owner = msg.sender;
        _erc20 = erc20;
    }
    
    modifier ownerOnly {
        require(msg.sender == _owner);
        _;
    }
    
    function setStableSupport(address stable, bool state) ownerOnly() public {
        _stables[stable] = state;
    }
    
    // AAVE Savings & Card Minting
    function mintCardsAndDepositStablecoin(uint256 amount, address stable) {
        // require(user approved at least amount)
        // transfer amount from user to this contract
        // Approve AAVEVault to take USDC
        // count tokens before
        // AAVEVault.deposit()
        // count tokens after
        // require(after - before == amount);
        
        // Approve GoGBattleCards to take amount
        // GoGBattleCards.mint(amount, msg.sender)
        // count tokens after2
        // require(after - after2 == amount)
    }
    
    // Match History
    function claimMatch(string memory ipfs) public {
        
    }
    
    function publicMatch(address winner, address loser, uint256 timestamp, string ipfs) refereeOnly() public {
        // GoGBattlesMatchHistory.publishMatch(winner, loser, timestamp, ipfs);
    }
}