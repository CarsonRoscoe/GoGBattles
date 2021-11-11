// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface Vault {
    function setPoolToken(address tokenAddress) external;
    function authorizeAToken(address token, address aToken) external;
    function depositUnnormalizedDecimals(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function withdrawNormalizedDecimals(address owner, uint256 amountNormalized, address stable) external returns(bool);
    function poolSize() external view returns(uint256);
    function accruePendingInterest() external returns(uint256);    
    function doesVaultTypeExist(address erc20Address) external view returns(bool);
    function balanceOfVaultsNormalizedDecimals() external view returns(uint256);
    function balanceOfVaultNormalizedDecimals(address erc20Address) external view returns(uint256);
}