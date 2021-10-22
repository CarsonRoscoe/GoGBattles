// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyaUSDC is ERC20 {
    constructor() ERC20("AAVE USD Coin", "aUSDC") {
    }

    function mint(address to, uint256 amount) public {
        super._mint(to, amount);
    }
}
