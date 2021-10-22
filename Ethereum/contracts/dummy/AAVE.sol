// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "../interfaces/AAVEInterface.sol";
import "./USDC.sol";
import "./aUSDC.sol";
import "./DAI.sol";
import "./aDAI.sol";
import "hardhat/console.sol";

contract DummyLendingPool is ILendingPool {
    DummyUSDC usdc;
    DummyaUSDC aUsdc;
    DummyDAI dai;
    DummyaDai aDai;

    constructor() {
        usdc = new DummyUSDC();
        aUsdc = new DummyaUSDC();
        dai = new DummyDAI();
        aDai = new DummyaDai();

        console.log("USDC: ");
        console.log(address(usdc));
        console.log("aUSDC: ");
        console.log(address(aUsdc));
        console.log("DAI: ");
        console.log(address(dai));
        console.log("aDAI: ");
        console.log(address(aDai));
    }
    

    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external override {
        ERC20 token = ERC20(asset);
        token.transferFrom(onBehalfOf, address(this), amount);
        if (address(token) == address(usdc)) {
            aUsdc.mint(onBehalfOf, amount);
        }
        else if (address(token) == address(dai)) {
            aDai.mint(onBehalfOf, amount);
        }
    }
    
    function withdraw(address asset, uint256 amount, address to) external override {
        ERC20 token  = ERC20(asset);
        token.transferFrom(to, address(this), amount);
        if (address(token) == address(aUsdc)) {
            usdc.mint(to, amount);
        }
        else if (address(token) == address(aDai)) {
            dai.mint(to, amount);
        }
    }
}

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
