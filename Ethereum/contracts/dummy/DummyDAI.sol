// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyDAI is ERC20 {
    constructor() ERC20("DAI", "DAI") {
    }

    function mint(address to, uint256 amount) public {
        super._mint(to, amount);
    }
}
