// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
    function setLendingPoolImpl(address pool) external;
    function getLendingPoolConfigurator() external view returns (address);
}

interface ILendingPool {
    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external;
}