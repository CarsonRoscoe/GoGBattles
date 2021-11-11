// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface Vault {
    function setPoolToken(address tokenAddress) external;
    function setLendingPoolAddressesProvider(address lendingPoolAddressesProvider) external;
    function authorizeAToken(address token, address aToken) external;
    function deposit(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function withdraw(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function poolSize() external view returns(uint256);
    function accruePendingInterest() external returns(uint256);    
    function doesVaultTypeExist(address erc20Address) external view returns(bool);
    function balanceOfVaults() external view returns(uint256);
    function balanceOfVault(address erc20Address) external view returns(uint256);
}