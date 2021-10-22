// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "../interfaces/Token.sol";

contract GoGBattlesToken_V1 is Token, ERC20, ERC20Permit, ERC20Burnable, AccessControl {
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");

    constructor() ERC20("GoG: Battles' Token", "GOGB") ERC20Permit("GoGBattleToken") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public override onlyRole(COORDINATOR_ROLE) {
        _mint(to, amount);
    }
    
    function mintBatch(address[] memory to, uint256[] memory amounts) public override onlyRole(COORDINATOR_ROLE) {
        require(to.length == amounts.length, "To and Amounts arrays must be equivalent size");
        for(uint i = 0; i < to.length; ++i) {
            _mint(to[i], amounts[i]);
        }
    }
    
    function burnFrom(address account, uint256 amount) public override(Token, ERC20Burnable) onlyRole(COORDINATOR_ROLE) {
        super.burnFrom(account, amount);
    }
    
    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20) {
        super._burn(account, amount);
    }
}
