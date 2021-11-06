// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/CardFactory.sol";
import "../interfaces/Cards.sol";
import "../interfaces/Vault.sol";

/**
    TODO:
    - Lock duration setable by DEFAULT_ADMIN
 */

contract GoGBattlesCards_V1 is Cards, ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    IERC20 _token;
    CardFactory _factory;
    Vault _vault;
    
    mapping(uint => uint) _tokenIdToCardId;
    mapping(uint => uint) _valueOfCards;
    mapping(uint => uint) _timelockOnCards;
    mapping(address => uint) _valueOfAccount;
    uint public nextTokenID;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC1155("https://guildsofgods.com/cards/") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
    }

    function setGoGBattlesTokenAndCardFactory(address gogBattlesToken, address gogBattlesCardFactory, address gogBattlesVault) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        _token = IERC20(gogBattlesToken);
        _factory = CardFactory(gogBattlesCardFactory);
        _vault = Vault(gogBattlesVault);
        require(address(_token) != address(0)); 
        require(address(_factory) != address(0)); 
        require(address(_vault) != address(0)); 
    }

    function setURI(string memory newuri) public override onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mintUnbacked(address to, uint cardId) public override onlyRole(MINTER_ROLE) returns(uint256) {
        uint id = nextTokenID++;
        _mint(to, id, 1, "0x0");
        _tokenIdToCardId[id] = cardId;
        return id;
    }

    function mintBatch(address to, uint256[] memory cardIds, uint256[] memory values) public override onlyRole(MINTER_ROLE) returns(uint256[] memory tokenIds) {
        require(cardIds.length == values.length, "Arrays must be of the same size");
        uint256[] memory ids = new uint256[](cardIds.length);
        uint256[] memory amounts = new uint256[](cardIds.length);
        for(uint i = 0; i < cardIds.length; ++i) {
            ids[i] = nextTokenID++;
            _tokenIdToCardId[ids[i]] = cardIds[i];
            _valueOfCards[ids[i]] = values[i];
            amounts[i] = 1;
        }
        _mintBatch(to, ids, amounts, "0x0");
        return ids;
    }
    
    function mintPack(address to, uint256 tokenAmount) public override onlyRole(MINTER_ROLE) returns(uint256[] memory tokenIds, uint256 tokensRemaining){
        require(address(_token) != address(0), "Setup incomplete. Token address must be set.");
        require(address(_vault) != address(0), "Setup incomplete. Vault address must be set.");
        require(address(_factory) != address(0), "Setup incomplete. Card Factory address must be set.");
        require(tokenAmount > 0, "Minting a pack requires a deposit.");
        (uint[] memory cardIds, uint[] memory cardValues, uint tokensRemaining) = _factory.rollCards(tokenAmount);
        require(tokenAmount - tokensRemaining > 0, "Cannot mint a pack if given a full refund.");
        require(_token.transferFrom(msg.sender, address(_vault), tokenAmount - tokensRemaining), "Token transfer must succeed for the tokenAmount provided, minus remaining tokens.");
        uint256[] memory tokenIds = mintBatch(to, cardIds, cardValues);
        return (tokenIds, tokensRemaining);
    }

    function burnBatch(address owner, uint256[] memory ids, uint256[] memory amounts) public override(Cards, ERC1155Burnable) onlyRole(COORDINATOR_ROLE) {
        super._burnBatch(owner, ids, amounts);
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

    function getCardId(uint tokenId) public view returns(uint) {
        require(tokenId < nextTokenID, "Token does not exist yet.");
        return _tokenIdToCardId[tokenId];
    }
    
    function _beforeTokenTransfer( address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data ) internal override virtual {
        // mint case
        if (from == address(0)) {
            for(uint i = 0; i < ids.length; ++i) {
                _timelockOnCards[ids[i]] = block.timestamp; // + howeverlong the lock period is
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

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId) public view override(IERC165, ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
