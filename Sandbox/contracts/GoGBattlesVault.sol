// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";


contract GoGBattlesVault is AccessControlUpgradeable {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    mapping(address => mapping(address => uint256)) depositedAmounts;
    mapping(address => address) supportedStablecoin;
    
    event DepositStable(address owner, address stable, uint256 amount);
    event WithdrawStable(address owner, address stable, uint256 amount);
    
    constructor() {
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
    }
    
    function deposit(address owner, uint256 amount, address stable) onlyRole(COORDINATOR_ROLE) public returns(bool)  {
        // require(supportedStablecoin[stable] != address(0), "Stablecoin address must be supported");
        // IERC20Upgradeable token = IERC20Upgradeable(stable);
        // require(token != address(0), "Stablecoin must be castable to IERC20");
        // require(token.allowance(msg.sender, owner) >= amount, "Vaul");
        return true;
    }
    
    function withdraw(address owner, uint256 amount, address stable) onlyRole(COORDINATOR_ROLE) public returns(bool) {
        
    }
    
    function poolSize() public returns(uint256) {
        return 1;// size of pool in interest available
    }
    
    // Stolen from Coordinator
    function _depositStablecoin(uint256 amount, address stable) private {
        // require(user approved at least amount)
        // transfer amount from user to this contract
        // require("USDC was transfered out of player")
        // Approve AAVEVault to take USDC
        // AAVEVault.deposit()
        // require("The VAULT grew by the depositted amount")
        // GoGBattleGAME.mint(msg.sender, amount);
    }
    
    function accruePendingInterest() public returns(uint256) {
        uint256 interestClaimed;
        return interestClaimed;
    }
    
    function doesVaultTypeExist(address erc20Address) public returns(bool) {
        return true;
    }
    
    function balanceOfVault(address erc20Address) public returns(uint256) {
        return 1_000_000;
    }
}