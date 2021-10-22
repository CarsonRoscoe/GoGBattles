// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/CardFactory.sol";
import "../interfaces/Cards.sol";


struct Card {
    uint backedValue;
}

contract GoGBattlesCards_V1 is Cards, ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    IERC20 _token;
    CardFactory _factory;
    
    mapping(uint => uint) _valueOfCards;
    mapping(uint => uint) _timelockOnCards;
    mapping(address => uint) _valueOfAccount;
    uint _nextTokenID;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC1155("https://guildsofgods.com/cards/") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
    }

    function setGoGBattlesTokenAndCardFactory(address gogBattlesToken, address gogBattlesCardFactory) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _token = IERC20(gogBattlesToken);
        _factory = CardFactory(gogBattlesCardFactory);
    }

    function setURI(string memory newuri) public override onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mint(uint256 value, bytes memory data) public override onlyRole(MINTER_ROLE) returns(uint256) {
        uint id = _nextTokenID++;
        _valueOfCards[id] = value;
        _mint(msg.sender, id, 1, data);
        return id;
    }

    function mintBatch(address to, uint256[] memory cardIds, uint256[] memory values) public override onlyRole(MINTER_ROLE) returns(uint256[] memory) {
        require(cardIds.length == values.length, "Arrays must be of the same size");
        uint256[] memory ids = new uint256[](cardIds.length);
        uint256[] memory amounts = new uint256[](cardIds.length);
        for(uint i = 0; i < amounts.length; ++i) {
            ids[i] = _nextTokenID++;
            _valueOfCards[ids[i]] = values[i];
            amounts[i] = 1;
        }
        _mintBatch(to, ids, amounts, "0x0");
        return ids;
    }
    
    function mintPack(address to, uint256 tokenAmount) public override onlyRole(MINTER_ROLE) returns(uint256[] memory, uint256){
        require(_token.transferFrom(msg.sender, address(this), tokenAmount), "Transfer must succeed");
        (uint[] memory cardIds, uint[] memory cardValues, uint tokensRemaining) = _factory.rollCards(tokenAmount);
        uint256[] memory tokenIds = mintBatch(to, cardIds, cardValues);
        if (tokensRemaining > 0) {
            _token.approve(msg.sender, tokensRemaining);
        }
        return (tokenIds, tokensRemaining);
    }

    function burnBatch(address owner, uint256[] memory ids, uint256[] memory amounts) public override(Cards, ERC1155Burnable) onlyRole(COORDINATOR_ROLE) {
        super.burnBatch(owner, ids, amounts);
    }
    
    function burnBatch(address owner, uint256[] memory ids) public override onlyRole(COORDINATOR_ROLE) {
        uint256[] memory amounts = new uint256[](ids.length);
        for(uint i = 0; i < ids.length; ++i) {
            amounts[i] = 1;
        }
        super.burnBatch(owner, ids, amounts);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId) public view override(IERC165, ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function backingValueOf(uint[] memory cardIds) public override view returns(uint) {
        uint result = 0;
        for(uint i = 0; i < cardIds.length; ++i) {
            result += _valueOfCards[cardIds[i]];
        }
        return result;
    }
    
    function backingBalanceOf(address user) public override view returns(uint) {
        return _valueOfAccount[user];
    }
    
    function _beforeTokenTransfer( address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data ) internal override virtual {
        // mint case
        if (from == address(0)) {
            for(uint i = 0; i < ids.length; ++i) {
                _timelockOnCards[ids[i]] = block.timestamp;
            }
        }
        
        // burn case
        if (to == address(0)) {
            for(uint i = 0; i < ids.length; ++i) {
                require(_timelockOnCards[ids[i]] < block.timestamp, "You cannot burn a card too soon after minting.");
            }
        }
        
        uint valueOfCards = 0;
        for(uint i = 0; i < ids.length; ++i) {
            valueOfCards += _valueOfCards[ids[i]];
        }
        
        if (from != address(0)) {
            _valueOfAccount[from] -= valueOfCards;
        }
        if (to != address(0)) {
            _valueOfAccount[to] += valueOfCards;
        }
    }
}
