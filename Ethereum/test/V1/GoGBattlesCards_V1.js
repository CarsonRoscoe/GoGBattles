const { Contract, ContractFactory } = require('@ethersproject/contracts');
const { SignerWithAddress } = require('@nomiclabs/hardhat-ethers/signers');
const { arrayify } = require('@ethersproject/bytes');
const { expect } = require('chai');
const { Wallet } = require('ethers');
const { ethers } = require('hardhat');

const Scenario_V1 = require('./V1.js');

let fullNames = {};
let dappFactory = {};
let dapp = {};
let user = {}
let roles = {};

async function resetScenario() {
  await Scenario_V1.resetScenarioAsync();
  let scenario = Scenario_V1.getScenario();
  fullNames = scenario.fullNames;
  dappFactory = scenario.dappFactory;
  dapp = scenario.dapp;
  user = scenario.user;
  roles = scenario.roles;
}

const delay = async (seconds) => {
  await ethers.provider.send('evm_increaseTime', [seconds]);
  await ethers.provider.send('evm_mine');
};

describe('GoG: Battles\' Cards Test Suite', () => {
  it('Scenario_V1 Loaded', async () => { await resetScenario(); });

  it("GoGBattlesCard\'s instantiation was a success. It should have the \'URI\' 'https://guildsofgods.com/cards/'", async () => {
    await expect(await dapp.GoGBattlesCards.uri(0)).to.equal('https://guildsofgods.com/cards/');
  });
  it("Deployer is setup with the proper roles for access control.", async () => {
    await expect(await dapp.GoGBattlesCards.hasRole(roles.DEFAULT_ADMIN_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.URI_SETTER_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.MINTER_ROLE, user.Deployer.address))
    await expect(await dapp.GoGBattlesCards.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address));
  });
  it("Deployer can assign COORDINATOR_ROLE and MINTER_ROLE, restricting itself.", async () => {    
    await expect(await dapp.GoGBattlesCards.grantRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesCards.renounceRole(roles.COORDINATOR_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesCards.hasRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address)).to.equal(false);

    await expect(await dapp.GoGBattlesCards.grantRole(roles.MINTER_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesCards.renounceRole(roles.MINTER_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesCards.hasRole(roles.MINTER_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.MINTER_ROLE, user.Deployer.address)).to.equal(false);

    await expect(await dapp.GoGBattlesToken.grantRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesToken.renounceRole(roles.COORDINATOR_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesToken.hasRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesToken.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address)).to.equal(false);
  });
  it("Deployed can setup dependent contracts.", async () => {
    await expect(await dapp.GoGBattlesCards.setGoGBattlesTokenAndCardFactory(dapp.GoGBattlesToken.address, dapp.GoGBattlesCardFactory.address, dapp.GoGBattlesVault.address));
  });
  it("Deployer cannot call mintUnbacked.", async () => {
    let tokenIdMinted = null
    let deployedFailedToCheat = true;
    try {
      tokenIdMinted = await dapp.GoGBattlesCards.connect(user.Deployer).mintUnbacked(user.Deployer.address, 1);
    } catch(e) {
      deployedFailedToCheat = false;
    }
    await expect(deployedFailedToCheat);
    await expect(tokenIdMinted).to.equal(null);
  });
  it("Users cannot call mintUnbacked.", async () => {
    let tokenIdMinted = null
    let bobFailedToCheat = true;
    try {
      tokenIdMinted = await dapp.GoGBattlesCards.connect(user.Bob).mintUnbacked(user.Bob.address, 1);
    } catch(e) {
      bobFailedToCheat = false;
    }
    await expect(bobFailedToCheat);
    await expect(tokenIdMinted).to.equal(null);
  });
  it("Minter can call mintUnbacked.", async () => {
    let tokenIdMinted = null
    let tokenCounter = await dapp.GoGBattlesCards.nextTokenID();
    // Mint succeeded
    await expect(tokenIdMinted = await dapp.GoGBattlesCards.connect(user.Coordinator).mintUnbacked(user.Jane.address, 1));
    // tokenIdMinted was set is set
    await expect(tokenIdMinted).to.not.equal(null);
    // User has 1 minted token
    await expect(await dapp.GoGBattlesCards.balanceOf(user.Jane.address, tokenIdMinted.value.toNumber())).to.equal(1);
    // Incremented token counter by 1
    await expect((await dapp.GoGBattlesCards.nextTokenID()) - tokenCounter).to.equal(1);

  });
  it("Deployer can not call mintBatch.", async () => {
    let tokenIdsMinted = null
    let deployedFailedToCheat = true;
    try {
      tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Deployer).mintBatch(user.Deployer.address, [1, 2], [0, 0]);
    } catch(e) {
      deployedFailedToCheat = false;
    }
    await expect(deployedFailedToCheat);
    await expect(tokenIdsMinted).to.equal(null);
  });
  it("Regular users can not call mintBatch.", async() => {
    let tokenIdsMinted = null
    let bobFailedToCheat = true;
    try {
      tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Bob).mintBatch(user.Bob.address, [1, 2], [0, 0]);
    } catch(e) {
      bobFailedToCheat = false;
    }
    await expect(bobFailedToCheat);
    await expect(tokenIdsMinted).to.equal(null);
  });
  it("Minter can mintBatch.", async () => {
    let tokenIdsMinted = null
    let initialTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();

    await expect(tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Coordinator).mintBatch(user.Jane.address, [1, 2], [5, 5]));
    await expect(tokenIdsMinted).to.not.equal(null);

    tokenIdsMinted = [];
    let tokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();

    for(let i = initialTokenCounter; i < tokenCounter; ++i) {
      tokenIdsMinted.push(i);
    }
    await expect(tokenIdsMinted.length).to.equal(2);
    await expect(await dapp.GoGBattlesCards.getCardId(tokenIdsMinted[0])).to.equal(1);
    await expect(await dapp.GoGBattlesCards.backingValueOf([tokenIdsMinted[0]])).to.equal(5);
    await expect(await dapp.GoGBattlesCards.getCardId(tokenIdsMinted[1])).to.equal(2);
    await expect(await dapp.GoGBattlesCards.backingValueOf([tokenIdsMinted[1]])).to.equal(5);
    await expect(await dapp.GoGBattlesCards.balanceOf(user.Jane.address, tokenIdsMinted[0])).to.equal(1);
    await expect(await dapp.GoGBattlesCards.balanceOf(user.Jane.address, tokenIdsMinted[1])).to.equal(1);
    await expect(await dapp.GoGBattlesCards.backingValueOf(tokenIdsMinted)).to.equal(10);
  });
  it("Minting batch mints correct values and cards", async () => {
    let tokenIdsMinted = null
    let initialTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();

    let tokens = 1000;
    let cardIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let values = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

    // Mint 1000 tokens to back cards
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, tokens);
    // Back card Ids 1-10, 100 tokens each
    await expect(tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Coordinator).mintBatch(user.Jane.address, cardIds, values));
    await expect(tokenIdsMinted).to.not.equal(null);

    tokenIdsMinted = [];
    let tokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();
    for(let i = initialTokenCounter; i < tokenCounter; ++i) {
      tokenIdsMinted.push(i);
    }
    await expect(tokenIdsMinted.length).to.equal(cardIds.length);

    for(let i = 0; i < tokenIdsMinted.length; ++i) {
      await expect(await dapp.GoGBattlesCards.getCardId(tokenIdsMinted[i])).to.equal(cardIds[i]);
      await expect(await dapp.GoGBattlesCards.backingValueOf([tokenIdsMinted[i]])).to.equal(values[i]);
      await expect(await dapp.GoGBattlesCards.balanceOf(user.Jane.address, tokenIdsMinted[i])).to.equal(1);
    }
    await expect(await dapp.GoGBattlesCards.backingValueOf(tokenIdsMinted)).to.equal(tokens);
  });
  it("Deployer cannot call MintPack", async () => {
    let tokenIdsMinted = null
    let deployedFailedToCheat = true;
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Deployer.address, 100);
    try {

      tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Deployer).mintPack(user.Deployer.address, 100);
    } catch(e) {
      deployedFailedToCheat = false;
    }
    await expect(deployedFailedToCheat);
    await expect(tokenIdsMinted).to.equal(null);
  });
  it("Regular users cannot call MintPack", async() => {
    let tokenIdsMinted = null
    let deployedFailedToCheat = true;
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Bob.address, 100);
    try {
      tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Deployer).mintPack(user.Bob.address, 100);
    } catch(e) {
      deployedFailedToCheat = false;
    }
    await expect(deployedFailedToCheat);
    await expect(tokenIdsMinted).to.equal(null);
  });
  it("Coordinator can call MintPack", async() => {
    let tokenIdsMinted = null
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 100);
    tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Coordinator).mintPack(user.Coordinator.address, 100);
    await expect(tokenIdsMinted).to.not.equal(null);
  });
  it("Calling MintPack requires token.Approve", async() => {
    let mintSucceededWithoutApprove = true;
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    try {
      await dapp.GoGBattlesCards.connect(user.Coordinator).mintPack(user.Coordinator.address, 100);
    }
    catch(e) {
      mintSucceededWithoutApprove = false;
    }
    await expect(mintSucceededWithoutApprove).to.equal(false);
  });
  it("Minting pack properly routes funds from Coordinator to Vault", async () => {
    let tokenIdsMinted = null
    let initialTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();

    let tokens = 1000;
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, tokens);

    let initialBalances = {
      Jane : await dapp.GoGBattlesToken.balanceOf(user.Jane.address),
      Coordinator : await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address),
      Cards : await dapp.GoGBattlesToken.balanceOf(dapp.GoGBattlesCards.address),
      Vault : await dapp.GoGBattlesToken.balanceOf(dapp.GoGBattlesVault.address)
    }

    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, tokens);
    await expect(tokenIdsMinted = await dapp.GoGBattlesCards.connect(user.Coordinator).mintPack(user.Jane.address, tokens));
    await expect(tokenIdsMinted).to.not.equal(null);

    let endBalances = {
      Jane : await dapp.GoGBattlesToken.balanceOf(user.Jane.address),
      Coordinator : await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address),
      Cards : await dapp.GoGBattlesToken.balanceOf(dapp.GoGBattlesCards.address),
      Vault : await dapp.GoGBattlesToken.balanceOf(dapp.GoGBattlesVault.address)
    }

    let tokensSpent = (initialBalances.Coordinator.toNumber() - endBalances.Coordinator.toNumber());
    let returnedTokens = tokens - tokensSpent;

    tokenIdsMinted = [];
    let tokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();
    for(let i = initialTokenCounter; i < tokenCounter; ++i) {
      tokenIdsMinted.push(i);
    }

    let pack = [];
    for(let i = 0; i < tokenIdsMinted.length; ++i) {
      let cardId = await dapp.GoGBattlesCards.getCardId(tokenIdsMinted[i]);
      let cardValue = await dapp.GoGBattlesCards.backingValueOf([tokenIdsMinted[i]]);
      await expect(await dapp.GoGBattlesCards.balanceOf(user.Jane.address, tokenIdsMinted[i])).to.equal(1);
      pack.push([tokenIdsMinted[i], cardId.toNumber(), cardValue.toNumber()]);
    }
    // console.info(pack);
    let backingValueOfCards = (await dapp.GoGBattlesCards.backingValueOf(tokenIdsMinted)).toNumber();
    await expect(backingValueOfCards > 0 && backingValueOfCards <= tokens);
    await expect((await dapp.GoGBattlesCards.backingValueOf(tokenIdsMinted)).toNumber() + returnedTokens).to.equal(tokens);

    await expect(endBalances.Jane - initialBalances.Jane).to.equal(0);
    await expect(endBalances.Coordinator - initialBalances.Coordinator).to.equal(-(1000 - returnedTokens));
    await expect(endBalances.Cards - initialBalances.Cards).to.equal(0);
    await expect(endBalances.Vault - initialBalances.Vault).to.equal((1000 - returnedTokens));
  });
  it("Only the coordinator can burnBatch.", async () => {
    let initialTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();
    let janesInitialTokens = [];
    let janesAmounts = [];
    for(let i = 0; i < initialTokenCounter; ++i) {
      let balance = (await dapp.GoGBattlesCards.balanceOf(user.Jane.address, i)).toNumber();
      if (balance > 0) {
        janesInitialTokens.push(i);
        janesAmounts.push(1);
      }
    }

    let janeFailedToBurn = false;
    try {
      await dapp.GoGBattlesCards.connect(user.Jane).burnBatch(user.Jane.address, janesInitialTokens, janesAmounts);
    } catch {
      janeFailedToBurn = true;
    }
    await expect(janeFailedToBurn);

    let deployedFailedToBurn = false;
    try {
      await dapp.GoGBattlesCards.connect(user.Deployer).burnBatch(user.Jane.address, janesInitialTokens, janesAmounts);
    } catch {
      deployedFailedToBurn = true;
    }
    await expect(deployedFailedToBurn);
    await delay(1 * 24 * 60 * 60);
    await expect(await dapp.GoGBattlesCards.connect(user.Coordinator).burnBatch(user.Jane.address, janesInitialTokens, janesAmounts));

    let janesEndingTokens = [];
    for(let i = 0; i < initialTokenCounter; ++i) {
      let balance = (await dapp.GoGBattlesCards.balanceOf(user.Jane.address, i)).toNumber();
      if (balance > 0) {
        janesEndingTokens.push(i);
      }
    }

    await expect(janesEndingTokens.length).to.not.equal(janesInitialTokens.length);
    await expect(janesEndingTokens.length).to.equal(0);

  });
  it("Card burning is locked for a time after being minted.", async () => {
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 100);
    await dapp.GoGBattlesCards.connect(user.Coordinator).mintBatch(user.Coordinator.address, [30], [100]);
    let tokenId = (await dapp.GoGBattlesCards.nextTokenID()).toNumber() - 1;

    let earlyBurnFailed = false;
    try {
      await dapp.GoGBattlesCards.connect(user.Coordinator).burnBatch(user.Coordinator.address, [tokenId], [1]);
    } catch(e) {
      earlyBurnFailed = true;
    }
    await expect(earlyBurnFailed);

    await delay(1 * 24 * 60 * 60);

    await expect(await dapp.GoGBattlesCards.connect(user.Coordinator).burnBatch(user.Coordinator.address, [tokenId], [1]));
    
  });
  it("Can determine the backing value of a card.", async () => {
    let initialTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();

    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 100);
    await dapp.GoGBattlesCards.connect(user.Coordinator).mintBatch(user.Chris.address, [30], [100]);

    await expect(await dapp.GoGBattlesCards.backingValueOf([initialTokenCounter]));
    initialTokenCounter++;


    // Reset balance of Coordinator to 0
    let tokenBalance = await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address);
    await dapp.GoGBattlesToken.connect(user.Coordinator).burn(tokenBalance);

    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 1000);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 1000);
    await dapp.GoGBattlesCards.connect(user.Coordinator).mintPack(user.Chris.address, 1000);

    let postTokenCounter = (await dapp.GoGBattlesCards.nextTokenID()).toNumber();
    let sum = 0;
    for(let i = initialTokenCounter; i < postTokenCounter; ++i) {
      sum += dapp.GoGBattlesCards.backingValueOf([i]);
    }
    await expect((sum + await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address)) == 1000);
  });
  it("Can determine the backing balance of an account.", async () => {
    // Reset balance of Coordinator to 0
    let tokenBalance = await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address);
    await dapp.GoGBattlesToken.connect(user.Coordinator).burn(tokenBalance);

    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 100);
    await dapp.GoGBattlesCards.connect(user.Coordinator).mintBatch(user.Chris.address, [30], [100]);

    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Coordinator.address, 100);
    await dapp.GoGBattlesToken.connect(user.Coordinator).approve(dapp.GoGBattlesCards.address, 100);
    await dapp.GoGBattlesCards.connect(user.Coordinator).mintPack(user.Chris.address, 100);


    let remainingTokens = await dapp.GoGBattlesToken.balanceOf(user.Coordinator.address);
    let value = await dapp.GoGBattlesCards.connect(user.Coordinator).backingBalanceOf(user.Chris.address);

    await expect(value > 100);
    await expect(value + remainingTokens == 200);
  });
});
