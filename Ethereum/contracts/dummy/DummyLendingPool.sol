// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "../interfaces/AAVEInterface.sol";
import "./DummyUSDC.sol";
import "./DummyaUSDC.sol";
import "./DummyDAI.sol";
import "./DummyaDAI.sol";
import "hardhat/console.sol";

contract DummyLendingPool is ILendingPool {
    DummyUSDC usdc;
    DummyaUSDC aUsdc;
    DummyDAI dai;
    DummyaDAI aDai;

    constructor(address usdcAddress, address aUSDCAddress, address daiAddress, address aDAIAddress) {
        usdc = DummyUSDC(usdcAddress);
        aUsdc = DummyaUSDC(aUSDCAddress);
        dai = DummyDAI(daiAddress);
        aDai = DummyaDAI(aDAIAddress);

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
