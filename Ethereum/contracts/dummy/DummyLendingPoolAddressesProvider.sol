// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "../interfaces/AAVEInterface.sol";
import "./DummyLendingPool.sol";

contract DummyLendingPoolAddressesProvider is ILendingPoolAddressesProvider {
    DummyLendingPool lendingPool;

    constructor() {
        lendingPool = new DummyLendingPool();
    }

    function getLendingPool() external override view returns (address) {
        return address(lendingPool);
    }

    function setLendingPoolImpl(address pool) external override {} // Set in constructor
    function getLendingPoolConfigurator() external override view returns (address) {}
}
