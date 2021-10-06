/**
 *Submitted for verification at polygonscan.com on 2021-09-27
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./GoGBattlesToken.sol";
import "./GoGBattlesCards.sol";
import "./GoGBattlesVault.sol";
import "./GoGBattlesMatchHistory.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract GoGBattlesCoordinator is AccessControlUpgradeable {
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant REFEREE_ROLE = keccak256("REFEREE_ROLE");
    
    event MintCards(address minter, uint[] cardIds);
    event BurnCards(address burner, uint[] cardIds);
    
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
    }
    
    
    modifier ensureUserRegistered {
        if (_userIds[msg.sender] == address(0)) {
            _userIds[msg.sender] = _userCount++;
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
    function SetGoGBattlesToken(address matchHistoryAddress) public onlyRole("OWNER_ROLE") {
        matchHistoryAddress = GoGBattlesMatchHistory(matchHistoryAddress);
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
        if (prizeSize > 0) {
            require(token.mint(amount), "Mint tokens for deposit");
            uint256[] cardIds = _mintCardsSafe(amount, winner);
            emit MintCards(msg.sender, cardIds);
        }
    }
    
    // Deposit into a vault and mint cards
    function mintCards(address vaultType, uint256 amount) public ensureUserRegistered() returns(uint256[] memory) {
        IERC20 erc20 = IERC20(vaultType);
        require(address(erc20) != address(0), "Passed in vaultType must be a valid ERC20.");
        _depositStablecoinSafe(erc20, amount, msg.sender);
        uint256[] cardIds = _mintCardsSafe(amount, msg.sender);
        return cardIds;
    }
    
    
    function burnCards(uint256[] calldata tokenIds) public ensureUserRegistered() returns(bool) {
        _burnCardsForTokenSafe(tokenIds, msg.sender);
    }
    
    function burnToken(uint256 amount, address erc20) public ensureUserRegistered() returns(bool) {
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
        require(token.mint(amount), "Mint tokens for distribution");
        
        uint256 amountToPool = amount * 70 / 100; // 70% of interest goes into the reward pool
        uint256 amountToUsers = amount * 25 / 100; // 25% of interest goes back to users as token yield
        uint256 amountToDevs = amount * 5 / 100; // 5% of interest goes to the dev fund
        
        require(amountToPool > 0, "Tokens must go to pool.");
        require(amountToUsers > 0, "Tokens must go to users.");
        require(amountToDevs > 0, "Tokens must go to. dev fund.");
        require(amountToPool + amountToUsers + amountToDevs == amount, "Tokens transfered must match interest accrued.");
        
        require(token.approve(address(vault), amountToPool), "Vault must be approved to receive pool deposit.");
        require(vault.depositToPool(amountToPool), "Deposit to pool must succeed.");
        
        for(uint i = 0; i < _users.length; ++i) {
            address userAddress = _users[i];
            uint tokenBalance = token.balanceOf(userAddress);
            cards.getValueOfCards();
        }
        
        _devTokenFund += amountToDevs;
    }
    
    // Core private functions
    function _depositStablecoinSafe(IERC20 erc20, uint256 amount, address receiver ) private {
        // Take deposit
        require(erc20.allowance(receiver, address(this)) > amount, "Contract must be first allowed to transfer.");
        require(erc20.transfer(receiver, address(this)));
        
        // Transfer deposit to vault and receive tokens
        require(vault.doesVaultTypeExist(address(erc20)), "No vaults exist for token type");
        require(erc20.approve(_gogBattlesVaultAddress, amount), "Must approve vault for token deposit.");
        require(vault.deposit(msg.sender, amount, stable), "Vault deposit must succeed.");
        
        // Mint token
        require(token.mint(amount), "Mint tokens for deposit");
    }
    
    function _mintCardsSafe(uint256 amount, address receiver) private returns(uint256[] memory) {
        // Mint cards
        require(token.approve(_gogBattlesCardsAddress, amount), "Card mint requires token deposit approval.");
        (uint256[] cardIds, uint256 unusedTokens) = cards.mintPack(msg.sender, amount);
        require(cardIds.length > 0, "Cards mint must succeed.");
        if (unusedTokens > 0) {
            require(token.transfer(msg.sender, unusedTokens), "Unused tokens must be returned to the user.");
        }
        
        emit MintCards(msg.sender, cardIds);
        
        return cardIds;
    }
    
    function _burnCardsForTokenSafe(uint256[] cardIds, address user) private returns(uint256) {
        require(cards.isApprovalForAll(user, address(this)), "Must be approved to burn send cards to burn");
        uint256 amount = cards.getValueOfCards(cardIds);
        require(amount > 0, "Cards must have a value to burn");
        require(cards.burnBatch(user, tokenIds), "Must burn all the cards");
        require(token.mint(user, amount), "Must mint value of cards.");
        require(token.transfer(user, amount), "Must transfer user. value of cards");
        
        emit BurnCards(user, cardIds);
        return amount;
    }
    
    function _withdrawStablecoinSafe(uint256 amount, address user, address erc20) private returns(uint256) {
        require(token.allowance(user, address(this) > amount), "User must approve contract to withdraw token.");
        require(token.transferFrom(user, address(this), amount), "User must transfer token back to contract.");
        require(token.approve(address(this), address(token), amount), "Must be approved to burn token");
        require(token.burn(amount), "Must burn amount");
        
        require(vault.doesVaultTypeExist(erc20), "ERC20 is not a supported vault type.");
        require(vault.balanceOfVault(address(erc20)) > amount, "Vault must be liquid");
        uint256 amountWithdrew = vault.withdraw(user, amount, erc20);
        require(amountWithdrew > 0, "Vault must withdraw desired token to user.");
        return amountWithdrew;
    }
}


    
    // function _mintCardsFromGAME(uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) private {
    //     // GoGBattlesToken.permit(msg.sender, address(this), value, deadline, v, r, s);
    //     // GoGBattlesToken.transferFrom(msg.sender, address(this), value);
    //     // GoGBattleCards.mint(amount, msg.sender)
    //     // count tokens after2
    //     // require(after - after2 == amount)
    // }