// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface Token is IERC20 {
    function mint(address to, uint256 amount) external;
    function mintBatch(address[] memory to, uint256[] memory amounts) external;
    function burnFrom(address from, uint256 amount) external;
}