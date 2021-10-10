# GoG: Battles

GoG: Battles! The Guilds of Gods themed NFT trading card game.

# Description

GoG: Battles is a trading card game whose themed after the indie mmorpg Guilds of Gods.

In GoG: Battles, players collect equipment cards used during battle. Once a battle begins, each player is assigned five adventurers, and players equip their equipment to their adventurers as they please. Battle phases are simulated, with the victor reigning supreme.

To mint new cards, users use the GoGBattleCardFactory contract to mint random cards. They send whatever asset and protocol they wish to back a card to the factory, as well as the amount of cards to mint. For example, a user might send 1000 USDT, wishing to put it in Compound Finance, at $100/card. These USDT tokens get deposited as cUSDTs to accumulate interest, and are held by the cards produced. 

Interest earned through the protocol is used to offer players a stable APY, as well as grow the prize pool. When a game is published to the block chain, a portion of the prize pool is allocated to minting a card to reward the victor.

To get back a players investment, they must burn their cards. Upon burning, the initial deposit of the cards, plus interest, will be transfered to the player.

# How It's Made

The protocol is split into five core contracts. The Coordinator, Token, Cards, CardFactory and Vault.

Token is the ERC20 token given to you upon depositing stablecoins. This token acts as a receipt for stablecoins, generalizing all supported stablecoins into one token. This token is what is actually burned when creating cards, and minted when burning cards. Cards are backed by Token.

Cards is a ERC1155 contract representing the individual minted cards. These cards are backed by Token and therefore by stablecoins. They can be burned to unlock their undelying value, and build in interest at a fixed APY. In the meta data, each minted card has a cardID, indexing it into the over 5000 registered cards. 

When users mint cards, they deposit stablecoins into the contract. The contract then directs these funds to the AAVE borrowing/lending protocol on Polygon, and deposits them, receiving aTokens in return. These aTokens will grow with as the stablecoins gain interest. The GoGBattlesVault contract can claim its earned interest, and distribute it to the APY yield pool and the Prize Pool. When users burn their cards, they get their stablecoins back, along with a stable interest rate. This includes cards earned from winning matches. As prizes are minted from a share of the prize pool, they are backed by interest. This allows us to create real value in our cards, while not requiring users pay to mint cards.

These contracts are all deployed to Polygon (mumbai).

Part of our protocol relies on a Referee actor. This actor is secured through OpenZeppelin's Defender product, which allows us to create a secure user who can hook into on-chain events and response to them. This referee wakes up when a user claims a match occured, runs the logic through a validator and confirms or rejects the claim.

We leaned heavily on decentralized storage. All NFT metadata is stored on IPFS, along with our Validation JavaScript functions, user-submitted game proofs, and our front-end.

We also deployed our front-end to Sia/Skynet/Homescreen, and created a ENS gogbattles.eth, that routes url requests to the sia hosted front-end.

# Sub-Projects

/frontend contains the front-end code.

/Sandbox contains the Solidity contracts, compilations and deployment scripts. 

/Defender contains the "Referee" logic in OpenZeppelin's Defender tool. See Defender/DefenderAutoTask/RefereeJustMatch.js for implementation.

/GoG-Battles contains the pseudo-server used for players to communicate through while a game is in session.

/Servers