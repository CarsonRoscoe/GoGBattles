// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/Vault.sol";
import "../interfaces/AAVEInterface.sol";

contract GoGBattlesVault_V1 is Vault, AccessControl {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant TOKEN_GATEKEEPER_ROLE = keccak256("TOKEN_GATEKEEPER_ROLE");
    
    // GoG:Battles Token
    address poolTokenAddress;
    
    // Map<Token Address, Balance> 
    mapping(address =>uint) vaultBalances;
    
    // List of Token Address
    address[] approvedTokens;
    mapping(address => uint) toE18Factor;
    
    // Map<TokenAddress, aTokenAddress>
    mapping(address => address) tokensToATokens;
    
    event DepositStable(address owner, address stable, uint amount);
    event WithdrawStable(address owner, address stable, uint amount);
    
    // AAVE
    ILendingPool lendingPool;
    ILendingPoolAddressesProvider provider;
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(TOKEN_GATEKEEPER_ROLE, msg.sender);
        
        // Retrieve LendingPool address
        // polygon:" 0xd05e3E715d945B59290df0ae8eF85c1BdB684744
        // mumbai: 0x178113104fEcbcD7fF8669a0150721e231F0FD4B
        // provider = ILendingPoolAddressesProvider(address(0x178113104fEcbcD7fF8669a0150721e231F0FD4B)); // polygon address
        // lendingPool = ILendingPool(provider.getLendingPool());
    }
    
    function setPoolToken(address tokenAddress) public override onlyRole(TOKEN_GATEKEEPER_ROLE) {
        require(address(IERC20(tokenAddress)) != address(0));
        poolTokenAddress = tokenAddress;
    }
    
    function authorizeAToken(address token, address aToken, uint decimals) public override onlyRole(TOKEN_GATEKEEPER_ROLE) {
        require(tokensToATokens[token] == address(0));
        require(tokensToATokens[aToken] == address(0));
        require(address(IERC20(token)) != address(0));
        require(address(IERC20(aToken)) != address(0));
        require(decimals <= 18);
        toE18Factor[token] = (10**(18-decimals));
        approvedTokens.push(token);
        tokensToATokens[token] = aToken;
    }
    
    function depositUnnormalizedDecimals(address owner, uint256 amountNormalized, address stable) onlyRole(COORDINATOR_ROLE) public override returns(bool)  {
        require(tokensToATokens[stable] != address(0), "Stablecoin address must be supported");
        uint256 amount = amountNormalized / toE18Factor[stable];
        IERC20 token = IERC20(stable);
        
        
        require(token.allowance(msg.sender, address(this)) >= amount, "Must be allowed to receive token.");
        require(token.transferFrom(msg.sender, address(this), amount));

        token.approve(address(lendingPool), amount);
        lendingPool.deposit(stable, amount, msg.sender, 0);
        
        emit DepositStable(owner, stable, amount );
        
        return true;
    }
    
    function withdrawNormalizedDecimals(address owner, uint256 amountNormalized, address stable) onlyRole(COORDINATOR_ROLE) public override returns(bool) {
        require(tokensToATokens[stable] != address(0), "Stablecoin address must be supported");
        uint256 amount = amountNormalized / toE18Factor[stable];
        
        lendingPool.withdraw(stable, amount, owner);
        
        emit WithdrawStable(owner, stable, amount);
        
        return true;
    }
    
    function poolSize() public override view returns(uint256) {
        return IERC20(poolTokenAddress).balanceOf(address(this));
    }
    
    function accruePendingInterest() public override returns(uint256) {
        uint interestClaimed;
        
        for(uint i = 0; i < approvedTokens.length; ++i) {
            address tokenAddress = approvedTokens[i];
            uint decimalFactor = toE18Factor[tokenAddress];
            address aTokenAddress = tokensToATokens[tokenAddress];
            IERC20 aToken = IERC20(aTokenAddress);
            
            uint balance = vaultBalances[tokenAddress];
            uint aBalance = aToken.balanceOf(address(this)) * decimalFactor;
            
            uint interest = aBalance - balance;
            
            vaultBalances[tokenAddress] = aBalance;
            
            interestClaimed += interest * decimalFactor;
        }
        
        return interestClaimed;
    }
    
    function doesVaultTypeExist(address erc20Address) public override view returns(bool) {
        return tokensToATokens[erc20Address] != address(0);
    }
    
    function balanceOfVaultsNormalizedDecimals() public override view returns(uint256) {
        uint256 size = 0;
        for(uint i = 0; i < approvedTokens.length; ++i) {
            address tokenAddress = approvedTokens[i];
            uint decimalFactor = toE18Factor[tokenAddress];
            address aTokenAddress = tokensToATokens[tokenAddress];
            IERC20 aToken = IERC20(aTokenAddress);
            
            size += aToken.balanceOf(address(this)) * decimalFactor;
        }
        return size; // size of pool in interest available
    }
    
    function balanceOfVaultNormalizedDecimals(address erc20Address) public override view returns(uint256) {
        require(doesVaultTypeExist(erc20Address), "Vault type does not exist");
        address aTokenAddress = tokensToATokens[erc20Address];
        uint decimalFactor = toE18Factor[erc20Address];
        IERC20 aToken = IERC20(aTokenAddress);
        return aToken.balanceOf(address(this)) * decimalFactor;
    }
}