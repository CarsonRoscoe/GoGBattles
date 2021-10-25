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

describe('GoG: Battles\' Token Test Suite', () => {
  it('Scenario_V1 Loaded', async () => { await resetScenario(); });

  it("GoGBattlesToken\'s instantiation was a success. It should have the \'Symbol\' GOGB, name \'\', and initial supply of 0.", async () => {
    await expect(await dapp.GoGBattlesToken.totalSupply()).to.equal(0);
    await expect(await dapp.GoGBattlesToken.name()).to.equal('GoG: Battles\' Token');
    await expect(await dapp.GoGBattlesToken.symbol()).to.equal('GOGB');
  });
  it("Deployer is setup with the DEFAULT_ADMIN_ROLE for access control.", async () => {

  });
  it("Only the coordinator can call mint, and mint is fully implemented, including batch mints.", async () => {
  });
});
