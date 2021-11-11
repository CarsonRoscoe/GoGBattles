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
  it("Deployer is setup with the proper roles for access control.", async () => {
    await expect(await dapp.GoGBattlesToken.hasRole(roles.DEFAULT_ADMIN_ROLE, user.Deployer.address));
    await expect(await dapp.GoGBattlesToken.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address));
  });
  it("Deployer can assign COORDINATOR_ROLE and restrict itself.", async () => {
    await expect(await dapp.GoGBattlesToken.grantRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesToken.renounceRole(roles.COORDINATOR_ROLE, user.Deployer.address));

    await expect(await dapp.GoGBattlesToken.hasRole(roles.COORDINATOR_ROLE, user.Coordinator.address));
    await expect(await dapp.GoGBattlesToken.hasRole(roles.COORDINATOR_ROLE, user.Deployer.address)).to.equal(false);
  });
  it("Only the coordinator can call mint", async () => {
    let deployerMinted = null;
    let bobMinted = null;

    try {
      await dapp.GoGBattlesToken.connect(user.Deployer).mint(user.Deployer.address, 1000);
      deployerMinted = true;
    }
    catch(e) {
      deployerMinted = false;
    }

    try {
      await dapp.GoGBattlesToken.connect(user.Bob).mint(user.Bob.address, 1000);
      bobMinted = true;
    }
    catch(e) {
      bobMinted = false;
    }
    await dapp.GoGBattlesToken.connect(user.Coordinator).mint(user.Jane.address, 1000);

    await expect(deployerMinted).to.equal(false);
    await expect(bobMinted).to.equal(false);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Deployer.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Bob.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Jane.address)).to.equal(1000);
  });
  it("Only the coordinator can call mintBatch", async () => {
    let deployerMinted = null;
    let bobMinted = null;

    try {
      await dapp.GoGBattlesToken.connect(user.Deployer).mintBatch([user.Deployer.address], [1000]);
      deployerMinted = true;
    }
    catch(e) {
      deployerMinted = false;
    }

    try {
      await dapp.GoGBattlesToken.connect(user.Bob).mintBatch([user.Bob.address], [1000]);
      bobMinted = true;
    }
    catch(e) {
      bobMinted = false;
    }
    await dapp.GoGBattlesToken.connect(user.Coordinator).mintBatch([user.Jane.address, user.Chris.address], [1000, 1000]);
    
    await expect(deployerMinted).to.equal(false);
    await expect(bobMinted).to.equal(false);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Deployer.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Bob.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Jane.address)).to.equal(2000);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Chris.address)).to.equal(1000);
  });
  it("Only the coordinator can call burnFrom", async () => {
    let deployerBurned = null;
    let bobBurned = null;

    try {
      await dapp.GoGBattlesToken.connect(user.Jane).approve(user.Deployer.address, 1000);
      await dapp.GoGBattlesToken.connect(user.Deployer).burnFrom(user.Jane.address, 1000);
      deployerBurned = true;
    }
    catch(e) {
      deployerBurned = false;
    }

    try {
      await dapp.GoGBattlesToken.connect(user.Jane).approve(user.Bob.address, 1000);
      await dapp.GoGBattlesToken.connect(user.Bob).burnFrom(user.Jane.address, 1000);
      bobBurned = true;
    }
    catch(e) {
      bobBurned = false;
    }
    await dapp.GoGBattlesToken.connect(user.Chris).approve(user.Coordinator.address, 1000);
    await dapp.GoGBattlesToken.connect(user.Coordinator).burnFrom(user.Chris.address, 1000);

    await expect(deployerBurned).to.equal(false);
    await expect(bobBurned).to.equal(false);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Deployer.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Bob.address)).to.equal(0);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Jane.address)).to.equal(2000);
    await expect(await dapp.GoGBattlesToken.balanceOf(user.Chris.address)).to.equal(0);
  });
});
