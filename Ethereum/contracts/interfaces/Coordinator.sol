// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

interface Coordinator {
    event MintCards(address minter, uint[] tokenIds);
    event BurnCards(address burner, uint[] tokenIds);
    
    function SetGoGBattlesToken(address tokenAddress) external;
    function SetGoGBattlesCards(address cardsAddress) external;
    function SetGoGBattlesVault(address vaultAddress) external;
    function SetGoGBattlesMatchHistory(address matchHistoryAddress) external;
    function claimMatchOccured(string calldata ipfs) external returns(bool);
    function publishMatch(address winner, address loser, uint256 timestamp, string calldata ipfs) external;
    function mintCards(address vaultType, uint256 amount) external returns(uint256[] memory);
    function burnCards(uint256[] calldata tokenIds) external;
    function burnToken(uint256 amount, address erc20) external;
    function claimGameInterest() external;
    function claim() external;
    function distributeInterest() external;
}
