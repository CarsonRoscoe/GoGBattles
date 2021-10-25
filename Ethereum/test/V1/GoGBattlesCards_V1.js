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

describe('GoG: Battles\' Cards Test Suite', () => {
  it('Scenario_V1 Loaded', async () => { await resetScenario(); });

  it("GoGBattlesCard\'s instantiation was a success. It should have the \'URI\' 'https://guildsofgods.com/cards/'", async () => {
    await expect(await dapp.GoGBattlesCards.uri(0)).to.equal('https://guildsofgods.com/cards/');
  });
  it("Deployer is setup with the proper roles for access control.", async () => {
    await expect(await dapp.GoGBattlesCards.hasRole(roles.DEFAULT_ADMIN_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.URI_SETTER_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesCards.hasRole(roles.MINTER_ROLE, user.Deployer.address));
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
  });
  it("Only the minter can mint.", async () => {
  });
  it("Only the minter can mintBatch.", async () => {
  });
  it("Only the minter can mintPack.", async () => {
  });
  it("Only the coordinator can burnBatch.", async () => {
  });
  it("Card burning is locked for a time after being minted.", async () => {

  });
  it("Can determine the backing value of a card.", async () => {

  });
  it("Can determine the backing balance of an account.", async () => {

  });
});
