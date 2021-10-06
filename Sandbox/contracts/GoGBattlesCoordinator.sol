/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./GoGBattlesToken.sol";
import "./GoGBattlesCards.sol";
import "./GoGBattlesVault.sol";
import "./GoGBattlesMatchHistory.sol";

contract GoGBattlesCoordinator is AccessControlUpgradeable {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant REFEREE_ROLE = keccak256("REFEREE_ROLE");
    
    event MintCards(address minter, uint[] tokenIds);
    event BurnCards(address burner, uint[] tokenIds);
    
    uint _devTokenFund;
    
    mapping(address => uint256) _userByIds;
    address[] _users;
    
    GoGBattlesToken token;
    GoGBattlesCards cards;
    GoGBattlesVault vault;
    GoGBattlesMatchHistory matchHistory;
    
    constructor() {
        __AccessControl_init();
        
        _devTokenFund = 0;

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(REFEREE_ROLE, msg.sender);
        
        _userByIds[address(0)] = 0;
        _users.push(address(0));
    }
    
    
    modifier ensureUserRegistered {
        if (_userByIds[msg.sender] == 0) {
            uint userId = _users.length;
            _users.push(msg.sender);
            _userByIds[msg.sender] = userId;
        }
        _;
    }
    
    function SetGoGBattlesToken(address tokenAddress) public onlyRole("OWNER_ROLE") {
        token = GoGBattlesToken(tokenAddress);
        require(address(token) != address(0), "Token address must be set.");
    }
    function SetGoGBattlesCards(address cardsAddress) public onlyRole("OWNER_ROLE") {
        cards = GoGBattlesCards(cardsAddress);
        require(address(cards) != address(0), "Cards address must be set.");
    }
    function SetGoGBattlesVault(address vaultAddress) public onlyRole("OWNER_ROLE") {
        vault = GoGBattlesVault(vaultAddress);
        require(address(vault) != address(0), "Vault address must be set.");
    }
    function SetGoGBattlesMatchHistory(address matchHistoryAddress) public onlyRole("OWNER_ROLE") {
        matchHistory = GoGBattlesMatchHistory(matchHistoryAddress);
        require(address(matchHistoryAddress) != address(0), "Match history address must be set.");
    }
    
    // Public interactable methods
    
    // User claims a match occured
    function claimMatchOccured(string calldata ipfs) public ensureUserRegistered() returns(bool) {
        // May emit   
        return true;
    }
    
    // Referee posts match history and gives rewards
    function publishMatch(address winner, address loser, uint256 timestamp, string calldata ipfs) onlyRole(REFEREE_ROLE) public {
        matchHistory.publishMatch(winner, loser, timestamp, ipfs);
        uint256 poolSize = vault.poolSize();
        uint256 prizeSize = poolSize / 100;
        require(prizeSize > 0, "There must be a prize");
        if (prizeSize > 0) {
            token.mint(address(this), prizeSize);
            uint256[] memory cardIds = _mintCardsSafe(prizeSize, winner);
            emit MintCards(msg.sender, cardIds);
        }
    }
    
    // Deposit into a vault and mint cards
    function mintCards(address vaultType, uint256 amount) public ensureUserRegistered() returns(uint256[] memory) {
        IERC20Upgradeable erc20 = IERC20Upgradeable(vaultType);
        require(address(erc20) != address(0), "Passed in vaultType must be a valid ERC20.");
        _depositStablecoinSafe(erc20, amount, msg.sender, address(this));
        uint256[] memory cardIds = _mintCardsSafe(amount, msg.sender);
        return cardIds;
    }
    
    
    function burnCards(uint256[] calldata tokenIds) public ensureUserRegistered() {
        _burnCardsForTokenSafe(tokenIds, msg.sender);
    }
    
    function burnToken(uint256 amount, address erc20) public ensureUserRegistered() {
        _withdrawStablecoinSafe(amount, msg.sender, erc20);
    }
    
    function claimGameInterest() public ensureUserRegistered() {
        // uint256 gameFromCards = GoGBattleCards.getGameValues(msg.sender);
        // uint256 gameBalance = GoGBattleGAME.balanceOf(msg.sender);
        // uint256 interest = AAVEVault.claimInterestAsGAME(msg.sender);
        // returns interest
    }
    
    function distributeInterest() public ensureUserRegistered() {
        // Require there is at least $0.01 in the pool
        uint256 amount = vault.accruePendingInterest();
        require(amount > 20, "There must be enough interest to collect that all parties get a share");
        
        uint256 amountToPool = amount * 70 / 100; // 70% of interest goes into the reward pool
        uint256 amountToUsers = amount * 25 / 100; // 25% of interest goes back to users as token yield
        uint256 amountToDevs = amount * 5 / 100; // 5% of interest goes to the dev fund
        
        require(amountToPool > 0, "Tokens must go to pool.");
        require(amountToUsers > 0, "Tokens must go to users.");
        require(amountToDevs > 0, "Tokens must go to. dev fund.");
        require(amountToPool + amountToUsers + amountToDevs == amount, "Tokens transfered must match interest accrued.");
        
        token.mint(address(vault), amountToPool);
        _devTokenFund += amountToDevs; // Allow devs to mint tokens
        
        uint tokenSupply = token.totalSupply();
        address[] memory users;
        uint256[] memory amountsToMint;
        uint amountGettingMinted;
        for(uint i = 0; i < _users.length; ++i) {
            address userAddress = _users[i];
            
            uint tokenBalance = token.balanceOf(userAddress);
            uint cardsTokenBalance = cards.backingBalanceOf(userAddress);
            uint userAmount = tokenBalance + cardsTokenBalance;
            
            if (userAmount > 0) {
                // !!! review
                uint amountToMint = userAmount * amountToDevs / tokenSupply; 
                if (amountToMint > 0) {
                    amountGettingMinted += amountToMint;
                    amountsToMint[i] = amountToMint;
                    users[i] = userAddress;
                }
            }
        }
        
        if (amountGettingMinted < amountToUsers) {
            _devTokenFund += amountToUsers - amountGettingMinted;
        }
        
        token.mintBatch(users, amountsToMint);
    }
    
    // Core private functions
    function _depositStablecoinSafe(IERC20Upgradeable erc20, uint256 amount, address ercDepositer, address tokenReceiver ) private {
        // Take deposit
        require(erc20.allowance(ercDepositer, address(this)) > amount, "Contract must be first allowed to transfer.");
        require(erc20.transferFrom(ercDepositer, address(this), amount), "Transfer to contract must succeed.");
        
        // Transfer deposit to vault and receive tokens
        require(vault.doesVaultTypeExist(address(erc20)), "No vaults exist for token type");
        require(erc20.approve(address(vault), amount), "Must approve vault for token deposit.");
        require(vault.deposit(msg.sender, amount, address(erc20)), "Vault deposit must succeed.");
        
        // Mint token
        token.mint(tokenReceiver, amount);
    }
    
    function _mintCardsSafe(uint256 amount, address receiver) private returns(uint256[] memory) {
        require(token.approve(address(cards), amount), "Card mint requires token deposit approval.");
        (uint256[] memory tokenIds, uint256 unusedTokens) = cards.mintPack(msg.sender, amount);
        require(tokenIds.length > 0, "Cards mint must succeed.");
        if (unusedTokens > 0) {
            require(token.transferFrom(address(cards), msg.sender, unusedTokens), "Unused tokens must be returned to the user.");
        }
        
        emit MintCards(msg.sender, tokenIds);
        return tokenIds;
    }
    
    function _burnCardsForTokenSafe(uint256[] memory tokenIds, address user) private returns(uint256) {
        require(cards.isApprovedForAll(user, address(this)), "Must be approved to burn send cards to burn");
        uint256 amount = cards.backingValueOf(tokenIds);
        require(amount > 0, "Cards must have a value to burn");
        
        cards.burnBatch(user, tokenIds);
        token.mint(user, amount);
        
        emit BurnCards(user, tokenIds);
        return amount;
    }
    
    function _withdrawStablecoinSafe(uint256 amount, address user, address erc20) private {
        require(token.allowance(user, address(this)) > amount, "User must approve contract to withdraw token.");
        require(token.transferFrom(user, address(this), amount), "User must transfer token back to contract.");
        
        require(token.approve(address(token), amount), "Must be approved to burn token");
        token.burn(amount);
        
        require(vault.doesVaultTypeExist(erc20), "ERC20 is not a supported vault type.");
        require(vault.balanceOfVault(address(erc20)) > amount, "Vault must be liquid");
        require(vault.withdraw(user, amount, erc20), "Vault must withdraw desired token to user.");
    }
}